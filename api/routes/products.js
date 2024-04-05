const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *        type: object
 *        required:
 *           - name
 *           - price
 *        properties:
 *           id:
 *              type: string
 *              description: The auto-generated id of the product
 *           name:
 *              type: string
 *              description: The name of the product
 *           price:
 *              type: number
 *              description: The price of the product
 *     ProductCreated:
 *        type: object
 *        properties:
 *           success_message:
 *                 type: string
 *           createdProduct:
 *                 type: object
 *                 properties:
 *                    name:
 *                       type: string
 *                       description: The name of the product
 *                    price:
 *                       type: number
 *                       description: The price of the product
 *                    id:
 *                      type: string
 *                      description: The auto-generated id of the product
 *     ProductsList:
 *        type: object
 *        properties:
 *           count:
 *              type: string
 *              description:  The total number of products found
 *           products:
 *              type: array
 *              items: 
 *                 type: object
 *                 properties:
 *                    id:
 *                      type: string
 *                      description: The auto-generated id of the product
 *                    name:
 *                       type: string
 *                       description: The name of the product
 *                    price:
 *                       type: number
 *                       description: The price of the product
 *   securitySchemes:
 *     bearerAuth:            
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
  * @swagger
  * tags:
  *   name: Products
  *   description: All product-related operations
  */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of products. See the ProductsList schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsList'
 * 
 */
router.get("/", ProductsController.products_get_all);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a product by providing a bearer auth token after logging in
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: Article 5
 *             price: 5.75
 *     responses:
 *       201:
 *         description: Product created. See the ProductCreated schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCreated'
 *       500:
 *         description: Some server error
 */
router.post("/", checkAuth, ProductsController.products_create_product);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Retrieve a product by it's id number
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product found. See the Product schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get("/:productId", ProductsController.products_get_product);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Edit a product by providing a bearer auth token after logging in
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID number of the product to be edited
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Edit the name and price of a product using the objects below or edit only the name or price of a product by using just one object. The object(s) must be contained in an array.           
 *       content:
 *         application/json:
 *           schema:
 *              type: array
 *              items:
 *                 type: object
 *                 properties:
 *                    propName:
 *                       type: string
 *                    value:
 *                       oneOf: 
 *                         - type: string
 *                         - type: number 
 *              example:
 *                 - propName: name
 *                   value: Article 10
 *                 - propName: price
 *                   value: 19.95 
 *     responses:
 *       201:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *              
 *       500:
 *         description: Some server error
 */
router.patch("/:productId", checkAuth, ProductsController.products_update_product);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove a specific product by providing a bearer auth token after logging in
 *     security:
 *        - bearerAuth: []
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID number of the product to be removed
 * 
 *     responses:
 *       200:
 *         description: Product removed
 *       404:
 *         description: The product was not found
 */
router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;
