from flask import Flask, render_template, request, redirect, session
import sqlite3

app = Flask(__name__)
app.secret_key = "secretkey"  # for session management

# Initialize database
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS products
                 (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT, description TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Home page: products, cart, and admin views
@app.route('/', methods=['GET'])
def index():
    view = request.args.get('view', 'products')  # default view = products

    # Fetch products from DB
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM products")
    products = c.fetchall()
    conn.close()

    # Fetch cart info
    cart_items = session.get('cart', [])
    total = sum(item['price'] for item in cart_items)

    return render_template('merged.html', view=view, products=products, cart=cart_items, total=total)

# Add product to cart
@app.route('/add_to_cart/<int:product_id>')
def add_to_cart(product_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM products WHERE id=?", (product_id,))
    product = c.fetchone()
    conn.close()

    if product:
        cart_item = {'id': product[0], 'name': product[1], 'price': product[2]}
        if 'cart' not in session:
            session['cart'] = []
        session['cart'].append(cart_item)
        session.modified = True
    return redirect('/?view=cart')  # stay on cart view

# Admin: add product
@app.route('/admin_action', methods=['POST'])
def admin_action():
    name = request.form.get('name')
    price = float(request.form.get('price'))
    category = request.form.get('category')
    description = request.form.get('description')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO products (name, price, category, description) VALUES (?, ?, ?, ?)",
              (name, price, category, description))
    conn.commit()
    conn.close()
    return redirect('/?view=admin')

# Delete product
@app.route('/delete_product/<int:product_id>')
def delete_product(product_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("DELETE FROM products WHERE id=?", (product_id,))
    conn.commit()
    conn.close()
    return redirect('/?view=admin')


if __name__ == '__main__':
    app.run(debug=True)
