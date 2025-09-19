from flask import Flask
from routes.cart_route import cart_bp 
from routes.user_route import user_bp
from routes.product_route import product_bp
from routes.invoice_route import invoice_bp

app = Flask(__name__)
app.register_blueprint(cart_bp)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(invoice_bp)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)