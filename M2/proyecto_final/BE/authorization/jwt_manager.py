import jwt

class JWTManager:
    def __init__(self, secret, algorithm):
        self.secret = secret
        self.algorithm = algorithm
    
    def encode(self, data):
        try:
            return jwt.encode(data, self.secret, algorithm=self.algorithm)
        
        except Exception as e:
            print(f'Error encoding JWT: {e}')
            return None
    
    def decode(self, token):
        try:
            return jwt.decode(token, self.secret, algorithms=[self.algorithm])
        
        except Exception as e:
            print(f'Error decoding JWT: {e}')
            return None
    
    