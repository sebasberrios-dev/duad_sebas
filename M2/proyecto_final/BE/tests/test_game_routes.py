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
        "username": "testdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "testdm",
        "email": "testdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "testdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def other_dm_token(client):
    ## Token de otro DM 
    response = client.post('/login', json={
        "username": "otherdm",
        "password": "dmpass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "otherdm",
        "email": "otherdm@test.com",
        "password": "dmpass123",
        "role": "dm"
    })
    response = client.post('/login', json={
        "username": "otherdm",
        "password": "dmpass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player_token(client):
    ## Token de jugador 
    response = client.post('/login', json={
        "username": "gameplayer",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "gameplayer",
        "email": "gameplayer@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "gameplayer",
        "password": "pass123"
    })
    return response.get_json().get("token")

@pytest.fixture
def admin_token(client):
    ## Token de administrador
    response = client.post('/login', json={
        "username": "gameadmin",
        "password": "admin123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    client.post('/register', json={
        "username": "gameadmin",
        "email": "gameadmin@test.com",
        "password": "admin123",
        "role": "admin"
    })
    response = client.post('/login', json={
        "username": "gameadmin",
        "password": "admin123"
    })
    return response.get_json().get("token")

class TestGameRoutes:
    ## Tests para las rutas de partidas 
    
    def test_create_game_success(self, client, dm_token):
        ## Test de creación exitosa de partida 
        response = client.post('/games/new', 
            json={
                "title": "Epic Campaign",
                "description": "A thrilling adventure",
                "link": "epic-campaign-123"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 201
        assert b"Game created successfully" in response.data

    def test_create_game_dm_only(self, client, player_token):
        ## Test de que solo DM puede crear partidas
        response = client.post('/games/new', 
            json={
                "title": "Player Game",
                "description": "Should fail",
                "link": "player-game"
            },
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 403

    def test_get_my_games(self, client, dm_token):
        ## Test de obtener mis partidas como DM
        # Crear una partida
        client.post('/games/new', 
            json={
                "title": "My Campaign",
                "description": "Test campaign",
                "link": "my-campaign"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        
        response = client.get('/my_games', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_game_by_link_success(self, client, dm_token, player_token):
        ## Test de acceder a partida por enlace de invitación 
        # Crear partida
        client.post('/games/new', 
            json={
                "title": "Link Game",
                "description": "Access by link",
                "link": "unique-invite-link"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        
        # Acceder por link
        response = client.get('/games/join/unique-invite-link', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["title"] == "Link Game"

    def test_get_game_by_link_not_found(self, client, player_token):
        ## Test de enlace no encontrado
        response = client.get('/games/join/nonexistent-link', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 404
        assert b"Invalid invitation link" in response.data

    def test_get_game_by_id(self, client, dm_token):
        ## Test de obtener partida por ID 
        # Crear partida
        create_response = client.post('/games/new', 
            json={
                "title": "ID Game",
                "description": "Get by ID",
                "link": "id-game-link"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        game_id = create_response.get_json()["game_id"]
        
        response = client.get(f'/games/{game_id}', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200

    def test_toggle_game_active_dm_only(self, client, dm_token, player_token):
        ## Test de activar/desactivar partida solo DM dueño
        # Crear partida
        create_response = client.post('/games/new', 
            json={
                "title": "Toggle Game",
                "description": "Test toggle",
                "link": "toggle-game"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        game_id = create_response.get_json()["game_id"]
        
        # DM puede toggle
        response = client.patch(f'/games/{game_id}/toggle-active', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 200
        
        # Player no puede
        response = client.patch(f'/games/{game_id}/toggle-active', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 403

    def test_update_game_owner_only(self, client, dm_token, other_dm_token):
        ## Test de actualización solo por DM dueño
        # Crear partida con dm_token
        create_response = client.post('/games/new', 
            json={
                "title": "Update Game",
                "description": "Original",
                "link": "update-game"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        game_id = create_response.get_json()["game_id"]
        
        # DM dueño puede actualizar
        response = client.put(f'/games/{game_id}', 
            json={"description": "Updated"},
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        assert response.status_code == 200
        
        # Otro DM no puede
        response = client.put(f'/games/{game_id}', 
            json={"description": "Hacked"},
            headers={"Authorization": f"Bearer {other_dm_token}"}
        )
        assert response.status_code == 403

    def test_delete_game_admin_only(self, client, admin_token, dm_token):
        ## Test de eliminación solo por admin
        # Crear partida con DM
        create_response = client.post('/games/new', 
            json={
                "title": "Delete Game",
                "description": "To be deleted",
                "link": "delete-game"
            },
            headers={"Authorization": f"Bearer {dm_token}"}
        )
        game_id = create_response.get_json()["game_id"]
        
        # Admin sí puede eliminar
        response = client.delete(f'/games/{game_id}', headers={
            "Authorization": f"Bearer {admin_token}"
        })
        print(f"Admin delete response: {response.status_code}, {response.get_json()}")
        assert response.status_code == 200

    def test_get_game_not_found(self, client, dm_token):
        ## Test de partida no encontrada
        response = client.get('/games/99999', headers={
            "Authorization": f"Bearer {dm_token}"
        })
        assert response.status_code == 404
