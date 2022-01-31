# Database Schema

## users
- id -> INTEGER
- firstname -> VARCHAR(255)
- lastname -> VARCHAR(255)
- email -> VARCHAR(255)
- password -> TEXT
- created_at -> TIMESTAMP

## categories
- id -> INTEGER
- name -> VARCHAR(255)
- created_at -> TIMESTAMP

## products
- id -> INTEGER
- name -> VARCHAR(255)
- description -> TEXT
- price -> FLOAT
- category_id -> INTEGER
- created_at -> TIMESTAMP

## orders
- id -> INTEGER
- status -> ENUM('Pending', 'Completed', 'Canceled')
- sub_total -> FLOAT
- user_id -> INTEGER
- created_at -> TIMESTAMP

## order_items
- id -> INTEGER
- name -> VARCHAR(255)
- order_id -> INTEGER
- product_id -> INTEGER
- price -> FLOAT
- quantity -> INTEGER
- created_at -> TIMESTAMP

## cart_items
- id -> INTEGER
- quantity -> INTEGER
- user_id -> INTEGER
- product_id -> INTEGER
- created_at -> TIMESTAMP


-------------------------------------------------------------------------------------

# API Endpoints

## Users
GET `/me`, Gets your own profile                                                    [Authentication Required]
GET `/users`, Lists all users                                                       [Authentication Required]
GET `/users/:id`, Gets a specific user                                              [Authentication Required]
GET `/users/:id/orders`, Gets a specific user's orders                              [Authentication Required]
GET `/users/:id/completed-orders`, Gets a specific user's completed orders          [Authentication Required]
GET `/users/1/current-order`, Gets a specific user's current order (In Cart)        [Authentication Required]
POST `/users`, Signup
POST `/users/login`, Signup

## Categories
GET `/categories/:id`, Gets a specific category
GET `/categories`, Gets all categories
GET `/categories/:id/products`, Gets the products of a certain category
POST `/categories`, Creates a category                                              [Authentication Required]

## Products
GET `/products/:id`, Gets a specific product
GET `/products`, Gets all products
GET `/products/popular`, Gets top 5 most popular products
POST `/products`, Creates a product                                                 [Authentication Required]

## Orders
GET `/orders/:id`, Gets a specific order                                            [Authentication Required]
POST `/order/place`, Creates/Places an order                                        [Authentication Required]
PATCH `/orders/:id`, Updates an order statuc (i.e. to make it Completed)            [Authentication Required]

## Cart
GET `/cart`, Gets your cart details (any items in it)                               [Authentication Required]
POST `/cart/items`, Adds/increases-the-quantity-of an item in your cart             [Authentication Required]
DELETE `/cart/items/:id`, Removes an item from your cart                            [Authentication Required]
DELETE `/cart/items`, Empties Your Cart                                             [Authentication Required]


## NOTES

- Sequelize
- Async/Await or Promises have catch statements.
- Contain one file in the model folder per table in the database.
- Postman


## TODO
- Every (database-action/endpoint) must have a passing test.
- README.md
