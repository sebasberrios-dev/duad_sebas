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
def admin_token(client):
    ## Token de usuario administrador para tests
    response = client.post('/login', json={
        "username": "admin",
        "password": "admin123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    # Si no existe, crear usuario admin
    client.post('/register', json={
        "username": "admin",
        "email": "admin@test.com",
        "password": "admin123",
        "role": "admin"
    })
    response = client.post('/login', json={
        "username": "admin",
        "password": "admin123"
    })
    return response.get_json().get("token")

@pytest.fixture
def player_token(client):
    ## Token de usuario jugador para tests
    response = client.post('/login', json={
        "username": "player1",
        "password": "pass123"
    })
    if response.status_code == 200:
        return response.get_json().get("token")
    # Si no existe, crear usuario player
    client.post('/register', json={
        "username": "player1",
        "email": "player1@test.com",
        "password": "pass123",
        "role": "player"
    })
    response = client.post('/login', json={
        "username": "player1",
        "password": "pass123"
    })
    return response.get_json().get("token")

class TestUserRoutes:
    ## Tests para las rutas de usuarios
    
    def test_liveness(self, client):
        ## Test del endpoint de salud
        response = client.get('/liveness')
        assert response.status_code == 200
        assert b"Hello, World!" in response.data

    def test_register_success(self, client):
        ## Test de registro exitoso
        import time
        unique_suffix = str(int(time.time() * 1000))  # Timestamp en milisegundos
        response = client.post('/register', json={
            "username": f"newuser_{unique_suffix}",
            "email": f"newuser_{unique_suffix}@test.com",
            "password": "newpass123",
            "role": "player"
        })
        assert response.status_code == 201
        data = response.get_json()
        assert "token" in data
        assert data["message"] == "User registered successfully"

    def test_register_missing_data(self, client):
        ## Test de registro con datos faltantes
        response = client.post('/register', json={
            "username": "incomplete"
        })
        assert response.status_code == 400
        assert b"data missing for registration" in response.data

    def test_register_invalid_role(self, client):
        ## Test de registro con rol inválido
        response = client.post('/register', json={
            "username": "baduser",
            "email": "bad@test.com",
            "password": "pass123",
            "role": "hacker"
        })
        assert response.status_code == 400
        assert b"invalid role" in response.data

    def test_register_duplicate_user(self, client):
        ## Test de registro con usuario duplicado
        # Crear usuario
        client.post('/register', json={
            "username": "duplicate",
            "email": "dup@test.com",
            "password": "pass123",
            "role": "player"
        })
        # Intentar crear de nuevo
        response = client.post('/register', json={
            "username": "duplicate",
            "email": "dup2@test.com",
            "password": "pass123",
            "role": "player"
        })
        assert response.status_code == 409
        assert b"user already exists" in response.data

    def test_login_success(self, client, player_token):
        ## Test de login exitoso
        response = client.post('/login', json={
            "username": "player1",
            "password": "pass123"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert "token" in data
        assert "user_id" in data
        assert "role" in data
        assert data["message"] == "Login successful"

    def test_login_invalid_credentials(self, client):
        ## Test de login con credenciales inválidas
        response = client.post('/login', json={
            "username": "nonexistent",
            "password": "wrongpass"
        })
        # El endpoint ahora devuelve 401 para credenciales inválidas
        assert response.status_code == 401
        assert b"invalid credentials" in response.data

    def test_login_missing_data(self, client):
        ## Test de login con datos faltantes
        response = client.post('/login', json={
            "username": "testuser"
        })
        assert response.status_code == 400
        assert b"data missing for login" in response.data

    def test_get_me_success(self, client, player_token):
        ## Test de obtener información del usuario autenticado
        response = client.get('/me', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert "id" in data
        assert "username" in data
        assert "role" in data

    def test_get_me_unauthorized(self, client):
        ## Test de /me sin autenticación
        response = client.get('/me')
        assert response.status_code == 401

    def test_update_user_own_account(self, client, player_token):
        ## Test de actualización de cuenta propia
        # Obtener user_id
        me_response = client.get('/me', headers={
            "Authorization": f"Bearer {player_token}"
        })
        user_id = me_response.get_json()["id"]
        
        response = client.put(f'/user/update/{user_id}', 
            json={"email": "newemail@test.com"},
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 200
        assert b"updated successfully" in response.data

    def test_update_user_unauthorized(self, client, player_token):
        ## Test de actualización de otro usuario sin permisos
        response = client.put('/user/update/999', 
            json={"email": "hack@test.com"},
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 403
        assert b"Unauthorized" in response.data

    def test_update_user_admin_can_update_any(self, client, admin_token, player_token):
        ## Test de admin actualizando cualquier usuario
        # Obtener user_id del player
        me_response = client.get('/me', headers={
            "Authorization": f"Bearer {player_token}"
        })
        user_id = me_response.get_json()["id"]
        
        response = client.put(f'/user/update/{user_id}', 
            json={"email": "adminchanged@test.com"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200

    def test_update_user_no_fields(self, client, player_token):
        ## Test de actualización sin campos
        me_response = client.get('/me', headers={
            "Authorization": f"Bearer {player_token}"
        })
        user_id = me_response.get_json()["id"]
        
        response = client.put(f'/user/update/{user_id}', 
            json={},
            headers={"Authorization": f"Bearer {player_token}"}
        )
        assert response.status_code == 400
        assert b"no fields to update" in response.data

    def test_delete_user_admin_only(self, client, admin_token):
        ## Test de eliminación de usuario solo por admin
        # Crear usuario para eliminar
        reg_response = client.post('/register', json={
            "username": "todelete",
            "email": "delete@test.com",
            "password": "pass123",
            "role": "player"
        })
        
        # Login para obtener user_id
        login_response = client.post('/login', json={
            "username": "todelete",
            "password": "pass123"
        })
        user_id = login_response.get_json()["user_id"]
        
        response = client.delete(f'/user/delete/{user_id}', headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        assert b"deleted successfully" in response.data

    def test_delete_user_player_cannot_delete(self, client, player_token):
        # Test de que un player no puede eliminar usuarios
        response = client.delete('/user/delete/1', headers={
            "Authorization": f"Bearer {player_token}"
        })
        assert response.status_code == 403
