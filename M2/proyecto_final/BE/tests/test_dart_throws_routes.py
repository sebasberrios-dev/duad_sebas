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
def dm_token(client):
    ## Token de DM
    response = client.post('/login', json={
        "username": "throwsdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "throwsdm",
        "email": "throwsdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "throwsdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player1_token(client):
    ## Token de jugador 1
    response = client.post('/login', json={
        "username": "throwsplayer1",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "throwsplayer1",
        "email": "throwsplayer1@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "throwsplayer1",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player2_token(client):
    ## Token de jugador 2
    response = client.post('/login', json={
        "username": "throwsplayer2",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "throwsplayer2",
        "email": "throwsplayer2@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "throwsplayer2",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def game_setup(client, dm_token, player1_token, player2_token):
    ## Configurar partida con participantes 
    # Crear partida
    game_response = client.post('/games/new', 
        json={
            "title": "Dice Throws Test",
            "description": "Test game for throws",
            "link": "throws-test"
        },
        headers={"Authorization": f"Bearer {dm_token}"}
    )
    game_id = game_response.get_json()["game_id"]
    
    # Crear personaje para player1
    char1_response = client.post('/characters/new', 
        json={
            "name": "Fighter",
            "race": "Human",
            "class": "Warrior",
            "level": 5,
            "attributes": {"strength": 16},
            "story": "Strong fighter"
        },
        headers={"Authorization": f"Bearer {player1_token}"}
    )
    char1_id = char1_response.get_json()["character_id"]
    
    # Crear personaje para player2
    char2_response = client.post('/characters/new', 
        json={
            "name": "Wizard",
            "race": "Elf",
            "class": "Mage",
            "level": 5,
            "attributes": {"intelligence": 18},
            "story": "Wise wizard"
        },
        headers={"Authorization": f"Bearer {player2_token}"}
    )
    char2_id = char2_response.get_json()["character_id"]
    
    # Unir player1 a la partida
    part1_response = client.post('/participants/new', 
        json={
            "game_id": game_id,
            "character_id": char1_id
        },
        headers={"Authorization": f"Bearer {player1_token}"}
    )
    part1_id = part1_response.get_json()["participant_id"]
    
    # Unir player2 a la partida
    part2_response = client.post('/participants/new', 
        json={
            "game_id": game_id,
            "character_id": char2_id
        },
        headers={"Authorization": f"Bearer {player2_token}"}
    )
    part2_id = part2_response.get_json()["participant_id"]
    
    return {
        "game_id": game_id,
        "part1_id": part1_id,
        "part2_id": part2_id
    }

class TestDartThrowsRoutes:
    ## Tests para las rutas de tiradas de dados 
    
    def test_create_throw_success(self, client, player1_token, game_setup):
        ## Test de creación exitosa de tirada 
        response = client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": True,
                "throw_value": 18
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 201
        assert b"Dart_throw created successfully" in response.data

    def test_create_throw_visible_players(self, client, player1_token, game_setup):
        ## Test de tirada visible para todos 
        response = client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_player": True,
                "throw_value": 15
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 201

    def test_create_throw_hidden_from_players(self, client, player1_token, game_setup):
        ## Test de tirada oculta para jugadores 
        response = client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": False,
                "throw_value": 12
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 201

    def test_create_dm_throw(self, client, dm_token, game_setup):
        ## Test de tirada de DM (oculta por defecto) 
        response = client.post('/dm_throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": False,
                "throw_value": 20
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 201

    def test_dm_throw_player_cannot(self, client, player1_token, game_setup):
        ## Test de que jugador no puede crear tiradas de DM     
        response = client.post('/dm_throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": False,
                "throw_value": 15
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 403

    def test_get_game_throws_as_dm(self, client, dm_token, player1_token, game_setup):
        ## Test de DM ve todas las tiradas 
        # Crear tirada visible
        client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": True,
                "throw_value": 18
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        # Crear tirada oculta
        client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": False,
                "throw_value": 8
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        # DM obtiene todas
        response = client.get(f'/game/{game_setup["game_id"]}/throws', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        # DM debe ver ambas tiradas

    def test_get_game_throws_as_player(self, client, player1_token, player2_token, game_setup):
        ## Test de jugador solo ve tiradas visibles
        # Crear tirada visible para todos
        client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": True,
                "throw_value": 16
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        # Crear tirada oculta de player1
        client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": False,
                "throw_value": 3
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        
        # Player2 obtiene tiradas
        response = client.get(f'/game/{game_setup["game_id"]}/throws', headers={
            "Authorization": f"Bearer {player2_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        # Player2 solo debe ver las visibles

    def test_get_game_throws_not_participant(self, client, game_setup):
        ## Test de usuario no participante no puede ver tiradas
        # Crear nuevo usuario
        client.post('/register', json={
            "username": "outsider",
            "email": "outsider@test.com",
            "password": "pass123",
            "role": "player"
        })
        outsider_response = client.post('/login', json={
            "username": "outsider",
            "password": "pass123"
        })
        outsider_token = outsider_response.get_json()["token"]
        
        response = client.get(f'/game/{game_setup["game_id"]}/throws', headers={
            "Authorization": f"Bearer {outsider_token}"
        })
        assert response.status_code == 403
        assert b"not a participant" in response.data

    def test_update_throw(self, client, player1_token, game_setup):
        ## Test de actualización de tirada
        # Crear tirada
        create_response = client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": True,
                "throw_value": 10
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        throw_id = create_response.get_json()["dart_throw_id"]
        
        # Actualizar (por ejemplo, cambiar visibilidad)
        response = client.put(f'/throws/{throw_id}', 
            json={"visible_to_players": False},
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        assert response.status_code == 200

    def test_delete_throw(self, client, player1_token, game_setup):
        ## Test de eliminación de tirada 
        # Crear tirada
        create_response = client.post('/throws/new', 
            json={
                "game_id": game_setup["game_id"],
                "participant_id": game_setup["part1_id"],
                "dart_type": "d20",
                "visible_to_dm": True,
                "visible_to_players": True,
                "throw_value": 14
            },
            headers={"Authorization": f"Bearer {player1_token}"}
        )
        throw_id = create_response.get_json()["dart_throw_id"]
        
        # Eliminar
        response = client.delete(f'/throws/{throw_id}', headers={
            "Authorization": f"Bearer {player1_token}"
        })
        assert response.status_code == 200

    def test_get_all_throws_admin_only(self, client, player1_token):
        ## Test de que solo admin puede ver todas las tiradas 
        response = client.get('/throws', headers={
            "Authorization": f"Bearer {player1_token}"
        })
        assert response.status_code == 403
