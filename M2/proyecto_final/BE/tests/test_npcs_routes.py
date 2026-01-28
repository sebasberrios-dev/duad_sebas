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
    """Token de usuario DM"""
    response = client.post('/login', json={
        "username": "npcsdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "npcsdm",
        "email": "npcsdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "npcsdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def other_dm_token(client):
    """Token de otro DM"""
    response = client.post('/login', json={
        "username": "othernpcsdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "othernpcsdm",
        "email": "othernpcsdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "othernpcsdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player_token(client):
    """Token de jugador"""
    response = client.post('/login', json={
        "username": "npcsplayer",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "npcsplayer",
        "email": "npcsplayer@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "npcsplayer",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def game_id(client, dm_token):
    """Crear una partida para las pruebas de NPCs"""
    response = client.post('/games/new', 
        json={
            "title": "NPCs Test Game",
            "description": "For testing NPCs",
            "link": "npcs-test-game"
        },
        headers={"Authorization": f"Bearer {dm_token}"}
    )
    return response.get_json()["game_id"]

class TestNPCRoutes:
    ## Tests para las rutas de NPCs
    
    def test_create_npc_success(self, client, dm_token, game_id):
        ## Test de creación exitosa de NPC por DM
        response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Goblin Chief",
                "role": "Goblin",
                "level": 5,
                "description": "Leader of the goblin tribe",
                "attributes": {"strength": 14, "dexterity": 12}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 201
        assert b"Npc created successfully" in response.data

    def test_create_npc_player_cannot(self, client, player_token, game_id):
        ## Test de que jugadores no pueden crear NPCs
        response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Hacker NPC",
                "role": "Merchant",
                "level": 1,
                "description": "Should fail",
                "attributes": {}
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 403

    def test_create_npc_wrong_dm(self, client, other_dm_token, game_id):
        ## Test de que solo el DM de la partida puede crear NPCs
        response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Wrong DM NPC",
                "role": "Orc",
                "level": 3,
                "description": "Not my game",
                "attributes": {"strength": 16}
            },
            headers={"Authorization": f"Bearer {other_dm_token}"}
        )
        assert response.status_code == 403
        assert b"Only the owner can create NPCs" in response.data

    def test_get_game_npcs_success(self, client, dm_token, game_id):
        ## Test de obtener NPCs de una partida
        # Crear NPC
        client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Test NPC",
                "role": "Elf",
                "level": 4,
                "description": "Forest guardian",
                "attributes": {"dexterity": 16}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        
        # Obtener NPCs
        response = client.get(f'/game/{game_id}/npcs', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_game_npcs_wrong_dm(self, client, other_dm_token, game_id):
        ## Test de que otro DM no puede ver NPCs de la partida
        response = client.get(f'/game/{game_id}/npcs', headers={
            "Authorization": f"Bearer {other_dm_token}"
        })
        assert response.status_code == 403
        assert b"Only the owner can view NPCs" in response.data

    def test_get_game_npcs_player_cannot(self, client, player_token, game_id):
        ## Test de que jugadores no pueden ver NPCs directamente
        response = client.get(f'/game/{game_id}/npcs', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 403

    def test_get_npc_by_id(self, client, dm_token, player_token, game_id):
        ## Test de obtener NPC por ID (jugadores pueden ver)
        # Crear NPC
        create_response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Friendly NPC",
                "role": "Merchant",
                "level": 2,
                "description": "Sells potions",
                "attributes": {"charisma": 14}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        npc_id = create_response.get_json()["npc_id"]
        
        # Jugador puede ver NPC específico
        response = client.get(f'/npcs/{npc_id}', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["name"] == "Friendly NPC"

    def test_get_npc_not_found(self, client, dm_token):
        ## Test de NPC no encontrado
        response = client.get('/npcs/99999', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 404
        assert b"NPC not found" in response.data

    def test_update_npc_owner_dm(self, client, dm_token, game_id):
        ## Test de actualización por DM dueño
        # Crear NPC
        create_response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "To Update",
                "role": "Dwarf",
                "level": 3,
                "description": "Original",
                "attributes": {"wisdom": 15}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        npc_id = create_response.get_json()["npc_id"]
        
        # Actualizar
        response = client.put(f'/npcs/{npc_id}', 
            json={"description": "Updated description"},
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 200

    def test_update_npc_wrong_dm(self, client, dm_token, other_dm_token, game_id):
        ## Test de que otro DM no puede actualizar NPCs
        # Crear NPC con dm_token
        create_response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Protected NPC",
                "role": "Elf",
                "level": 6,
                "description": "Protected",
                "attributes": {"intelligence": 18}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        npc_id = create_response.get_json()["npc_id"]
        
        # Otro DM intenta actualizar
        response = client.put(f'/npcs/{npc_id}', 
            json={"description": "Hacked"},
            headers={"Authorization": f"Bearer {other_dm_token}"}
        )
        assert response.status_code == 403
        assert b"Only the owner can update NPCs" in response.data

    def test_delete_npc_owner_dm(self, client, dm_token, game_id):
        ## Test de eliminación por DM dueño
        # Crear NPC
        create_response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "To Delete",
                "role": "Goblin",
                "level": 2,
                "description": "Will be deleted",
                "attributes": {"dexterity": 14}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        npc_id = create_response.get_json()["npc_id"]
        
        # Eliminar
        response = client.delete(f'/npcs/{npc_id}', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200

    def test_delete_npc_wrong_dm(self, client, dm_token, other_dm_token, game_id):
        ## Test de que otro DM no puede eliminar NPCs
        # Crear NPC
        create_response = client.post('/npcs/new', 
            json={
                "game_id": game_id,
                "name": "Cant Delete",
                "role": "Merchant",
                "level": 4,
                "description": "Protected",
                "attributes": {"strength": 16}
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        npc_id = create_response.get_json()["npc_id"]
        
        # Otro DM intenta eliminar
        response = client.delete(f'/npcs/{npc_id}', headers={
            "Authorization": f"Bearer {other_dm_token}"
        })
        assert response.status_code == 403
        assert b"Only the owner can delete NPCs" in response.data
