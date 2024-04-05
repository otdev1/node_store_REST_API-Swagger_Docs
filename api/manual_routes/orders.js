const express = require('express');
const router = express.Router(); //see https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const mongoose = require('mongoose');

const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const checkAuth = require('../middleware/check-auth');

// router.get('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'Orders were fetched'
//     });
// });

//RETRIEVE ALL ORDERS
router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('product quantity _id') //specifies which keys should be included in the docs object
        //.populate('product') 
        /* the populate function accepts the property of the model which should be populated with
        the info(i.e properties and values) from another model as an argument
        sets the product of property of the order object with
        detail info about a product i.e name id price, this action is made possible because relationship
        made between an order and product using ref see orderModel.js
        see https://mongoosejs.com/docs/populate.html*/
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length, //no of orders found
                orders: docs.map(doc => {
                  return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                      type: "GET",
                      url: "https://ot-node-rest-api.onrender.com/orders/" + doc._id
                    }
                  };
                })
            });   
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


// router.post('/', (req, res, next) => {
//     res.status(201).json({ //201 status code indicates that everything was successful and resource was created
//         message: 'Orders were created'
//     });
// });
// router.post('/', (req, res, next) => {
//     const order = {
//         productId: req.body.productId,
//         quantity: req.body.quantity
//     };
//     res.status(201).json({ //201 status code indicates that everything was successful and resource was created
//         message: 'Order was created',
//         order: order
//     });
// });

// router.post('/', (req, res, next) => {
//     const order = new Order({
//         _id: mongoose.Types.ObjectId(), //the Object() function is used automatically generate an id for the order
//         quantity: req.body.quantity,
//         product: req.body.productId
//     });
//     order
//         .save()
//         //.exec() //the exec() function does not have to be used with the save() function because save returns a real promise by default 
//         .then(result => {
//             console.log(result);
//             res.status(201).json(result);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

//CREATE A NEW ORDER
router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
    /*note because the body property of the request object is expected to have a productId property
    the structure of the request in JSON should be 
    {
        "productId": "someproductidnumber",
        "quantity": "no.of products"
    }quantity is optional */
    .then(product => {
      if (!product) { //checks if a product with the productid provided exists so that an order cannot be created for a non-esisting product
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
            _id: mongoose.Types.ObjectId(), //the Object() function is used automatically generate an id for the order
            quantity: req.body.quantity,
            product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: "https://ot-node-rest-api.onrender.com/orders/" + result._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});


// router.get('/:orderId', (req, res, next) => {
//     res.status(200).json({
//         message: 'Order details',
//         orderId: req.params.orderId //req.params.pathname corresponds to /:pathname in this case orderId
//     });
// });
//RERIEVE A SPECIFIC ORDER
router.get("/:orderId", checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
      .populate('product') 
      .exec()
      .then(order => {
        if (!order) { //checks if the order corresponding to provided orderid exists
          return res.status(404).json({
            message: "Order not found"
          });
        }
        res.status(200).json({
            order: order,
            request: {
              type: "GET",
              url: "https://ot-node-rest-api.onrender.com/orders"
            }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

// router.delete('/:orderId', (req, res, next) => {
//     res.status(200).json({
//         message: 'Order deleted',
//         orderId: req.params.orderId //req.params.pathname corresponds to /:pathname in this case orderId
//     });
// });

//DELETE A SPECIFIC ORDER
// router.delete("/:orderId", (req, res, next) => {
//     Order.remove({ _id: req.params.orderId })
//       .exec()
//       .then(result => {
//         res.status(200).json({
//           message: "Order deleted",
//           request: {
//             type: "POST",
//             url: "http://localhost:3000/orders",
//             body: { productId: "ID", quantity: "Number" }
//           }
//         });
//       })
//       .catch(err => {
//         res.status(500).json({
//           error: err
//         });
//       });
//   });


  router.delete("/:orderId", checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
      .exec()
      .then(order => {
        if (!order) {
           return res.status(404).json({
              message: "Order not found",
              request: {
                type: "GET",
                url: "https://ot-node-rest-api.onrender.com/orders"
              }
           });
        }
        Order.remove({ _id: req.params.orderId })
                .exec()
                .then(result => {
                    res.status(200).json({
                    message: "Order deleted",
                    request: {
                        type: "POST",
                        url: "https://ot-node-rest-api.onrender.com/orders",
                        body: { productId: "ID", quantity: "Number" }
                    }
                });
                })
                .catch(err => {
                res.status(500).json({
                    error: err
                });
                });
           
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;
