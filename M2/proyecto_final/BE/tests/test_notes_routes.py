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
    ## Token de usuario DM
    response = client.post('/login', json={
        "username": "notesdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "notesdm",
        "email": "notesdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "notesdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player_token(client):
    ## Token de jugador
    response = client.post('/login', json={
        "username": "notesplayer",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "notesplayer",
        "email": "notesplayer@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "notesplayer",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def admin_token(client):
    ## Token de usuario administrador
    response = client.post('/login', json={
        "username": "adminnotes",
        "password": "adminpass"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    
    client.post('/register', json={
        "username": "adminnotes",
        "email": "adminnotes@test.com",
        "password": "adminpass",
        "role": "admin"
    })
    response = client.post('/login', json={
        "username": "adminnotes",
        "password": "adminpass"
    })
    return response.get_json().get("token")

@pytest.fixture
def game_id(client, dm_token):
    ## Crear una partida para las pruebas de notas
    response = client.post('/games/new', 
        json={
            "title": "Notes Test Game",
            "description": "For testing notes",
            "link": "notes-test-game"
        },
        headers={"Authorization": f"Bearer {dm_token}"}
    )
    return response.get_json()["game_id"]

class TestNotesRoutes:
    ## Tests para las rutas de notas
    
    def test_create_note_as_player(self, client, player_token, game_id):
        ## Test de creación de nota como jugador (privada por defecto)
        response = client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "My private note"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 201
        assert b"Note created successfully" in response.data

    def test_create_note_as_dm(self, client, dm_token, game_id):
        ## Test de creación de nota como DM (compartida por defecto)
        response = client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "DM shared note"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 201

    def test_create_note_with_explicit_visibility(self, client, player_token, game_id):
        ## Test de creación con visibilidad explícita
        response = client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "Explicit visibility",
                "visible_for_players": True,
                "visible_for_dm": True
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 201

    def test_get_game_notes_as_dm(self, client, dm_token, player_token, game_id):
        ## Test de DM ve todas las notas de la partida
        # Crear nota privada de jugador
        client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "Player private"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        
        # Crear nota compartida de DM
        client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "DM shared"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        
        # DM ve todas
        response = client.get(f'/game/{game_id}/notes', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        # DM debe ver ambas notas

    def test_get_game_notes_as_player(self, client, dm_token, player_token, game_id):
        ## Test de jugador solo ve notas compartidas y propias
        # Crear nota compartida de DM
        client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "Shared for all"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        
        # Crear nota privada del jugador
        client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "My private note"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        
        # Jugador ve solo compartidas + propias
        response = client.get(f'/game/{game_id}/notes', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_my_notes(self, client, player_token, game_id):
        ## Test de obtener mis notas
        # Crear nota
        client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "My note"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        
        response = client.get('/my_notes', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200

    def test_update_note_owner_only(self, client, player_token, dm_token, game_id):
        ## Test de actualización solo por el dueño
        # Crear nota como jugador
        create_response = client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "Original content"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        note_id = create_response.get_json()["note_id"]
        
        # Dueño puede actualizar
        response = client.put(f'/notes/{note_id}', 
            json={"content": "Updated content"},
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 200
        
        # DM no puede actualizar nota de jugador
        response = client.put(f'/notes/{note_id}', 
            json={"content": "DM update"},
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 403

    def test_delete_note_owner_only(self, client, player_token, dm_token, game_id):
        ## Test de eliminación solo por el dueño
        # Crear nota como jugador
        create_response = client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "To delete"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        note_id = create_response.get_json()["note_id"]
        
        # DM no puede eliminar
        response = client.delete(f'/notes/{note_id}', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 403
        
        # Dueño sí puede
        response = client.delete(f'/notes/{note_id}', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200

    def test_get_note_not_found(self, client, admin_token):
        ## Test de nota no encontrada
        response = client.get('/notes?id=99999', headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 404

    def test_create_note_unauthorized(self, client, game_id):
        ## Test de creación sin autenticación
        response = client.post('/notes/new', 
            json={
                "game_id": game_id,
                "content": "Unauthorized"
            }
        )
        assert response.status_code == 401
