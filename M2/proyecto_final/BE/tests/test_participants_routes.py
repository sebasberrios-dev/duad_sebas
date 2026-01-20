import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

import pytest
from BE.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def player1_token(client):
    ## Token de jugador 1
    response = client.post('/login', json={
        "username": "partplayer1",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "partplayer1",
        "email": "partplayer1@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "partplayer1",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player2_token(client):
    ## Token de jugador 2
    response = client.post('/login', json={
        "username": "partplayer2",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "partplayer2",
        "email": "partplayer2@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "partplayer2",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def dm_token(client):
    ## Token de DM
    response = client.post('/login', json={
        "username": "partdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "partdm",
        "email": "partdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "partdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def game_id(client, dm_token):
    ## Crear una partida
    response = client.post('/games/new', 
        json={
            "title": "Participants Test",
            "description": "Test game",
            "link": "participants-test"
        },
        headers={"Authorization": f"Bearer {dm_token}"}
    )
    return response.get_json()["game_id"]

@pytest.fixture
def character_id(client, player1_token):
    ## Crear un personaje
    response = client.post('/characters/new', 
        json={
            "name": "Part Test Char",
            "race": "Human",
            "class": "Fighter",
            "level": 3,
            "attributes": {"strength": 15},
            "story": "Test character"
        },
        headers={"Authorization": f"Bearer {player1_token}"}
    )
    return response.get_json()["character_id"]

class TestParticipantRoutes:
    ## Tests para las rutas de participantes
    
    def test_create_participant_success(self, client, player1_token, game_id, character_id):
        ## Test de creación exitosa de participante
        response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 201
        assert b"Participant created successfully" in response.data

    def test_create_participant_character_not_owned(self, client, player1_token, player2_token, game_id):
        ## Test de que no puedes unirte con personaje de otro
        # Crear personaje con player2
        char_response = client.post('/characters/new', 
            json={
                "name": "Player2 Char",
                "race": "Elf",
                "class": "Wizard",
                "level": 2,
                "attributes": {"intelligence": 16},
                "story": "Not yours"
            },
            headers={"Authorization": f"Bearer {player2_token}"}
        )
        char_id = char_response.get_json()["character_id"]
        
        # Player1 intenta usar ese personaje
        response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": char_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 403
        assert b"does not belong to user" in response.data

    def test_create_participant_duplicate(self, client, player1_token, game_id, character_id):
        ## Test de que no puedes unirte dos veces a la misma partida
        # Primera vez
        client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        # Crear otro personaje
        char2_response = client.post('/characters/new', 
            json={
                "name": "Second Char",
                "race": "Dwarf",
                "class": "Cleric",
                "level": 3,
                "attributes": {"wisdom": 15},
                "story": "Second character"
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        char2_id = char2_response.get_json()["character_id"]
        
        # Intentar unirse de nuevo
        response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": char2_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 409
        assert b"already participating" in response.data

    def test_get_my_participations(self, client, player1_token, game_id, character_id):
        ## Test de obtener mis participaciones
        # Crear participación
        client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        response = client.get('/my_participations', headers={
            "Authorization": f"Bearer {player1_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_game_participants(self, client, player1_token, dm_token, game_id, character_id):
        ## Test de obtener participantes de una partida
        # Crear participación
        client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        # Participante puede ver
        response = client.get(f'/game/{game_id}/participants', headers={
            "Authorization": f"Bearer {player1_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_game_participants_unauthorized(self, client, player2_token, game_id):
        ## Test de que usuario no participante no puede ver participantes
        response = client.get(f'/game/{game_id}/participants', headers={
            "Authorization": f"Bearer {player2_token}"
        })
        assert response.status_code == 403
        assert b"Unauthorized" in response.data

    def test_delete_participant_self(self, client, player1_token, game_id, character_id):
        ## Test de que puedes salir de una partida
        # Unirse
        create_response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        part_id = create_response.get_json()["participant_id"]
        
        # Salir
        response = client.delete(f'/participants/{part_id}', headers={
            "Authorization": f"Bearer {player1_token}"
        })
        assert response.status_code == 200

    def test_delete_participant_dm_can(self, client, player1_token, dm_token, game_id, character_id):
        ## Test de que DM puede expulsar participantes
        # Jugador se une
        create_response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        part_id = create_response.get_json()["participant_id"]
        
        # DM expulsa
        response = client.delete(f'/participants/{part_id}', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200

    def test_delete_participant_other_player_cannot(self, client, player1_token, player2_token, game_id, character_id):
        ## Test de que otro jugador no puede expulsar
        # Player1 se une
        create_response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        part_id = create_response.get_json()["participant_id"]
        
        # Player2 intenta expulsar
        response = client.delete(f'/participants/{part_id}', headers={
            "Authorization": f"Bearer {player2_token}"
        })
        assert response.status_code == 403
        assert b"Unauthorized" in response.data

    def test_update_participant(self, client, player1_token, game_id, character_id):
        ## Test de actualización de participante
        # Crear participación
        create_response = client.post('/participants/new', 
            json={
                "game_id": game_id,
                "character_id": character_id
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        part_id = create_response.get_json()["participant_id"]
        
        # Actualizar (por ejemplo, cambiar personaje)
        # Crear nuevo personaje
        char2_response = client.post('/characters/new', 
            json={
                "name": "New Char",
                "race": "Halfling",
                "class": "Rogue",
                "level": 2,
                "attributes": {"dexterity": 17},
                "story": "New character"
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        char2_id = char2_response.get_json()["character_id"]
        
        response = client.put(f'/participants/{part_id}', 
            json={"character_id": char2_id},
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 200
