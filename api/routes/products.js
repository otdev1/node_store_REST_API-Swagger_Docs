//SEE ALSO NODE REST SHOP API TUT 12
const express = require('express');
const router = express.Router(); //see https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const mongoose = require('mongoose');
//const multer = require('multer'); 
/*multer package is used parses form body data, image/file will be sent as form data instead
of raw JSON data*/

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

//handle a request for or return of 1 product
// router.get('/:productId', (req, res, next) => {
//     const id = req.params.productId;
//     if (id === 'special') {
//         res.status(200).json({
//             message: 'discovered special id',
//             id: id
//         })
//     } else {
//         res.status(200).json({
//             message: 'you passed an id'
//         });
//     }
// });
// router.get("/:productId", (req, res, next) => {
//     const id = req.params.productId;
//     /*Product imported using const Product = require('../models/productModel')
//       the Product is a model and this allows the finById function to be available for use
//       see https://mongoosejs.com/docs/models.html#querying
//           https://mongoosejs.com/docs/queries.html
//     */
//     Product.findById(id)
//       .select('name price _id productImage') 
//       .exec()
//       .then(doc => {
//         console.log("From database", doc);
//         if (doc) {
//           //res.status(200).json(doc);
//           res.status(200).json({
//             product: doc,
//             request: {
//                 type: 'GET',
//                 description: 'Get all products',
//                 url: 'http://localhost:3000/products'
//             }
//           });
//         } else {
//           res
//             .status(404)
//             .json({ message: "No valid entry found for provided ID" });
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
//   });


// router.patch('/:productId', (req, res, next) => {
//         res.status(200).json({
//             message: 'updated product',
//         });
// });
// router.patch("/:productId", checkAuth, (req, res, next) => {
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) { /*loops through each operation i.e each product(made up of a name and price property) 
//     of the request body, request body is expected to be an array*/
//     updateOps[ops.propName] = ops.value; /*propName is a place holder for the properties of req.body
//     in this case name and price as defined in productModel
//     updateOps can store changes made to both name and price or to a single one of these properties
//     in postman along with id of object to be updated Body req object must be passed in this format
//     [
	
//       {"propName":"name", "value": "Harry Potter 6"}
      
//     ]
//     */
//   }
//   Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       console.log(result);
//       //res.status(200).json(result);
//       res.status(200).json({
//         message: 'Product updated',
//         request: {
//             type: 'GET',
//             url: 'http://localhost:3000/products/' + id
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });


// router.delete('/:productId', (req, res, next) => {
//     res.status(200).json({
//         message: 'deleted product',
//     });
// });
// router.delete("/:productId", checkAuth, (req, res, next) => {
//   const id = req.params.productId; //req.params.pathname corresponds to /:pathname in this case productId
//   Product.remove({ _id: id })
//     .exec()
//     .then(result => {
//       //res.status(200).json(result);
//       res.status(200).json({
//         message: 'Product deleted',
//         request: {
//             type: 'POST',
//             description: 'Create a new product',
//             url: 'http://localhost:3000/products',
//             body: { name: 'String', price: 'Number' }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;
