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
def player_token(client):
    ## Token de usuario jugador
    response = client.post('/login', json={
        "username": "charplayer",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "charplayer",
        "email": "charplayer@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "charplayer",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def other_player_token(client):
    ## Token de otro jugador
    response = client.post('/login', json={
        "username": "otherplayer",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "otherplayer",
        "email": "other@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "otherplayer",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def admin_token(client):
    ## Token de administrador
    response = client.post('/login', json={
        "username": "charadmin",
        "password": "admin123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "charadmin",
        "email": "charadmin@test.com",
        "password": "admin123",
        "role": "admin"
    })
    response = client.post('/login', json={
        "username": "charadmin",
        "password": "admin123"
    })
    return response.get_json().get("token")

class TestCharacterRoutes:
    ## Tests para las rutas de personajes
    
    def test_create_character_success(self, client, player_token):
        ## Test de creación exitosa de personaje
        response = client.post('/characters/new', 
            json={
                "name": "Aragorn",
                "race": "Human",
                "class": "Ranger",
                "level": 5,
                "attributes": {"strength": 15, "dexterity": 14},
                "story": "A ranger from the north"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 201
        assert b"Character created successfully" in response.data

    def test_create_character_unauthorized(self, client):
        ## Test de creación sin autenticación 
        response = client.post('/characters/new', 
            json={
                "name": "Test",
                "race": "Elf",
                "class": "Wizard",
                "level": 1,
                "attributes": {},
                "story": "Test"
            }
        )
        assert response.status_code == 401

    def test_get_my_characters(self, client, player_token):
        ## Test de obtener personajes propios
        # Crear un personaje primero
        client.post('/characters/new', 
            json={
                "name": "MyChar",
                "race": "Dwarf",
                "class": "Fighter",
                "level": 3,
                "attributes": {"strength": 16},
                "story": "Strong fighter"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        
        response = client.get('/my_characters', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_my_characters_empty(self, client, other_player_token):
        ## Test de obtener personajes cuando no hay ninguno 
        response = client.get('/my_characters', headers={
            "Authorization": f"Bearer {other_player_token}"
        })
        # Ahora devuelve 200 con objeto {message, characters: []}
        assert response.status_code == 200
        data = response.get_json()
        # Puede ser lista vacía o objeto con 'characters'
        if isinstance(data, dict):
            assert data.get("characters") == []
        else:
            assert data == []

    def test_get_character_by_id_owner(self, client, player_token):
        ## Test de obtener personaje por ID siendo el dueño 
        # Crear personaje
        create_response = client.post('/characters/new', 
            json={
                "name": "TestChar",
                "race": "Halfling",
                "class": "Rogue",
                "level": 2,
                "attributes": {"dexterity": 18},
                "story": "Sneaky rogue"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        response = client.get(f'/characters/{char_id}', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["name"] == "TestChar"

    def test_get_character_by_id_not_owner(self, client, player_token, other_player_token):
        ## Test de obtener personaje de otro usuario
        # Crear personaje con player_token
        create_response = client.post('/characters/new', 
            json={
                "name": "PrivateChar",
                "race": "Elf",
                "class": "Wizard",
                "level": 4,
                "attributes": {"intelligence": 17},
                "story": "Wise wizard"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        # Intentar acceder con other_player_token
        response = client.get(f'/characters/{char_id}', headers={
            "Authorization": f"Bearer {other_player_token}"
        })
        assert response.status_code == 403
        assert b"Unauthorized" in response.data

    def test_get_character_by_id_admin(self, client, player_token, admin_token):
        ## Test de admin puede ver cualquier personaje
        # Crear personaje con player_token
        create_response = client.post('/characters/new', 
            json={
                "name": "AdminView",
                "race": "Orc",
                "class": "Barbarian",
                "level": 6,
                "attributes": {"strength": 18},
                "story": "Strong orc"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        # Admin puede ver
        response = client.get(f'/characters/{char_id}', headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200

    def test_get_character_not_found(self, client, player_token):
        ## Test de personaje no encontrado - ahora devuelve 200 con character: null
        response = client.get('/characters/99999', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data.get("character") is None or data.get("message") == "Character not found"

    def test_update_character_owner(self, client, player_token):
        ## Test de actualización por el dueño
        # Crear personaje
        create_response = client.post('/characters/new', 
            json={
                "name": "ToUpdate",
                "race": "Human",
                "class": "Paladin",
                "level": 3,
                "attributes": {"strength": 14},
                "story": "Holy knight"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        # Actualizar
        response = client.put(f'/characters/update/{char_id}', 
            json={"level": 4},
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 200
        assert b"updated successfully" in response.data

    def test_update_character_not_owner(self, client, player_token, other_player_token):
        ## Test de actualización por otro usuario 
        # Crear personaje con player_token
        create_response = client.post('/characters/new', 
            json={
                "name": "Protected",
                "race": "Elf",
                "class": "Druid",
                "level": 5,
                "attributes": {"wisdom": 16},
                "story": "Nature lover"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        # Intentar actualizar con other_player_token
        response = client.put(f'/characters/update/{char_id}', 
            json={"level": 10},
            headers={"Authorization": f"Bearer {other_player_token}"}
        )
        assert response.status_code == 403
        assert b"Unauthorized" in response.data

    def test_delete_character_owner(self, client, player_token):
        ## Test de eliminación por el dueño
        # Crear personaje
        create_response = client.post('/characters/new', 
            json={
                "name": "ToDelete",
                "race": "Gnome",
                "class": "Bard",
                "level": 2,
                "attributes": {"charisma": 15},
                "story": "Musician"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        # Eliminar
        response = client.delete(f'/characters/delete/{char_id}', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        assert b"deleted successfully" in response.data

    def test_delete_character_not_owner(self, client, player_token, other_player_token):
        ## Test de eliminación por otro usuario
        # Crear personaje con player_token
        create_response = client.post('/characters/new', 
            json={
                "name": "CantDelete",
                "race": "Tiefling",
                "class": "Warlock",
                "level": 4,
                "attributes": {"charisma": 17},
                "story": "Dark pact"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        char_id = create_response.get_json()["character_id"]
        
        # Intentar eliminar con other_player_token
        response = client.delete(f'/characters/delete/{char_id}', headers={
            "Authorization": f"Bearer {other_player_token}"
        })
        assert response.status_code == 403
        assert b"Unauthorized" in response.data
