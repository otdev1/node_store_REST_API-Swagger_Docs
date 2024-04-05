const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *        type: object
 *        required:
 *           - product
 *        properties:
 *           order: 
 *               type: object
 *               properties:
 *                  quantity:
 *                     type: number
 *                     description: The quantity of the product ordered
 *                  id:
 *                     type: string
 *                     description: The auto-generated id of the order
 *                  product:
 *                     type: object
 *                     required:
 *                        - name
 *                        - price
 *                     properties:
 *                        id:
 *                           type: string
 *                           description: The auto-generated id of the product
 *                        name:
 *                           type: string
 *                           description: The name of the product
 *                        price:
 *                           type: number
 *                           description: The price of the product
 *               description: The order details
 *     OrderCreated:
 *        type: object
 *        properties:
 *           success_message:
 *              type: string
 *           createdOrder:
 *              type: object
 *              properties:
 *                 id:
 *                    type: string
 *                    description: The auto-generated id of the order
 *                 product:
 *                    type: string
 *                    description: The name of the product
 *                 quantity:
 *                    type: number
 *                    description: The price of the product
 *     OrdersList:
 *        type: object
 *        properties:
 *           count:
 *              type: string
 *              description:  The total number of orders found
 *           orders:
 *              type: array
 *              items:
 *                 type: object
 *                 required:
 *                    - product
 *                 properties:
 *                    id:
 *                       type: string
 *                       description: The auto-generated id of the order
 *                    product:
 *                       type: object
 *                       properties:
 *                          id:
 *                             type: string
 *                             description: The auto-generated id of the product
 *                          name:
 *                             type: string
 *                             description: The name of the product
 *                       description: The product details
 *                    quantity:
 *                       type: number
 *                       description: The quantity of the product ordered
 *   securitySchemes:
 *     bearerAuth:            
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
  * @swagger
  * tags:
  *   name: Orders
  *   description: All order-related operations
  */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Returns a list of all orders when a bearer auth token is provided after logging in
 *     tags: [Orders]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       201:
 *         description: The list of orders. See the OrdersList schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersList'
 * 
 * 
 */
router.get("/", checkAuth, OrdersController.orders_get_all);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order by providing a bearer auth token after logging in
 *     tags: [Orders]
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                 productId:
 *                    type: string
 *                    description: The id of the product to be ordered
 *                    example: 63fba5b3b4dd810040c2c160
 *                 quantity:
 *                    type: string
 *                    description: The quantity of the product to be ordered
 *                    example: 10
 *     responses:
 *       201:
 *         description: Order Created. See the OrderCreated schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCreated'
 */
router.post("/", checkAuth, OrdersController.orders_create_order);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Retrieve an order by it's id number
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the order to be retrieved
 *     responses:
 *       200:
 *         description: Order found. See the Order schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: The order was not found
 */
router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete a specific order
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the order to be deleted
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: The order was not found
 */
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
