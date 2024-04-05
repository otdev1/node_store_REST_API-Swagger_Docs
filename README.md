This API implements some of the operations that are associated with a typical online shopping platform and I built it to showcase my skills in API development. 
It is lightweight and uses the Mongoose object data modeling library to facilitate interaction with a MongoDB database. 
Requests and responses sent to and from it are in JSON format.

SIGN UP AS NEW USER

HTTP request type: POST

Request URL: https://ot-node-rest-api.onrender.com/user/signup

Request data format:

{
    "email": "example@example.com",
    "password": "1234"
}

Success response data:

{
    "message": "User created"
}

##

LOG IN

HTTP request type: POST

Request URL: https://ot-node-rest-api.onrender.com/user/login

Request data format:

{
    "email": "example@example.com",
    "password": "1234"
}

Success response data:

{
    "message": "Auth successful",
    "token": 211-character JSON web token
}

##

RETRIEVE ALL PRODUCTS

HTTP request type: GET

Request URL: https://ot-node-rest-api.onrender.com/products

Request data format: none

Success response data: 

{
    "count": total number of products,
    "products": [
        {
            "name": productname,
            "price": productprice,
            "_id": productid,
            "request": {
                "url": "https://ot-node-rest-api.onrender.com/products/productid",
                "type": "GET",
                "description": "Get more details about this product"
            }
        }
    ]
}

##

RETRIEVE DATA FOR A SPECIFIC PRODUCT

HTTP request type: GET

Request URL: https://ot-node-rest-api.onrender.com/products/productid

Request data format: none

Success response data: 

{
    "product": {
        "_id": productid,
        "name": productname,
        "price": productprice
    },
    "request": {
        "url": "https://ot-node-rest-api.onrender.com/products",
        "type": "GET",
        "description": "Get all products"
    }
}

##

CREATE A PRODUCT

HTTP request type: POST

Authorization header parameter value: Bearer 211-character JSON web token

Request URL: https://ot-node-rest-api.onrender.com/products

Request data format: 

{
    "name": "productname",
    "price": "0.00"
}

Success response data:

{
    "message": "Created product successfully",
    "createdProduct": {
        "name": productname,
        "_id": productid,
        "request": {
            "url": "https://ot-node-rest-api.onrender.com/products/productid",
            "type": "GET",
            "description": "Get more details about this product"
        }
    }
}

##

UPDATE A PRODUCT

HTTP request type: PATCH

Authorization header parameter value: Bearer 211-character JSON web token 

Request URL: https://ot-node-rest-api.onrender.com/products/productid

Request data format: 

[
      {"propName":"name", "value": "newproductname"}
]
where propName can either be name or price, the value for price must be a number

Success response data:

{
    "message": "Product updated",
    "request": {
        "url": "https://ot-node-rest-api.onrender.com/products/productid",
        "type": "GET"
    }
}

##

DELETE A PRODUCT

HTTP request type: DELETE

Authorization header parameter value: Bearer 211-character JSON web token 

Request URL: https://ot-node-rest-api.onrender.com/products/productid

Request data format: none

Success response data:

{
    "message": "Product deleted",
    "request": {
        "url": "https://ot-node-rest-api.onrender.com/products",
        "body": {
            "name": "String",
            "price": "Number"
        },
        "type": "POST",
        "description": "Create a new product"
    }
}

##

RETRIEVE ALL ORDERS

HTTP request type: GET

Authorization header parameter value: Bearer 211-character JSON web token

Request URL: https://ot-node-rest-api.onrender.com/orders

Request data format: none

Success response data: 

{
    "count": total number of orders,
    "orders": [
        {
            "_id": orderid,
            "product": {
                "_id": productid,
                "name": productname
            },
            "quantity": productquantity,
            "request": {
                "url": "https://ot-node-rest-api.onrender.com/orders/orderid ",
                "type": "GET",
                "description": "Get more details about this order"
            }
        }
    ]
}

##

RETRIEVE A SPECIFIC ORDER

HTTP request type: GET

Authorization header parameter value: Bearer 211-character JSON web token

Request URL: https://ot-node-rest-api.onrender.com/orders/orderid

Request data format: none

Success response data:

{
    "order": {
        "quantity": productquantity,
        "_id": orderid,
        "product": {
            "_id": productid,
            "name": productname,
            "price": productprice,
            "__v": 0
        },
        "__v": 0
    },
    "request": {
        "url": "https://ot-node-rest-api.onrender.com/orders",
        "type": "GET",
        "description": "Get all orders"
    }
}

##

CREATE AN ORDER

HTTP request type: POST

Authorization header parameter value: Bearer 211-character JSON web token

Request URL: https://ot-node-rest-api.onrender.com/orders

Request data format: 

{
    "quantity": "productquantity",
    "productId": "productid"
}

Success response data:

{
    "message": "Order stored",
    "createdOrder": {
        "_id": orderid,
        "product": productname,
        "quantity": productquantity
    },
    "request": {
        "url": "https://ot-node-rest-api.onrender.com/orders/orderid",
        "type": "GET",
        "description": "Get more details about this order"
    }
}

##

DELETE AN ORDER

HTTP request type: POST

Authorization header parameter value: Bearer 211-character JSON web token

Request URL: https://ot-node-rest-api.onrender.com/orders/orderid

Request data format: none

Success response data:

{
    "message": "Order deleted",
    "request": {
        "url": "https://ot-node-rest-api.onrender.com/orders",
        "type": "POST",
        "body": {
            "productId": "ID",
            "quantity": "Number"
        }
    }
}

##


