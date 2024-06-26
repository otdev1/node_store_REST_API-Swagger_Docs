const mongoose = require("mongoose");
const Product = require('../models/productModel');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select("name price _id") 
    .exec() 
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        products: docs.map(doc => { 
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              description: "Get more details about this product",
              url:"https://ot-node-rest-api.onrender.com/products/" + doc._id
            }
            };
          })
      };
      
      res.status(200).json(response);

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
   
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(), 
    name: req.body.name, 
    price: req.body.price, 
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
              type: 'GET',
              description: "Get more details about this product",
              url: "https://ot-node-rest-api.onrender.com/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id') 
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        //res.status(200).json(doc);
        res.status(200).json({
          product: doc,
          request: {
              type: 'GET',
              description: 'Get all products',
              url: 'https://ot-node-rest-api.onrender.com/products'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) { 
    updateOps[ops.propName] = ops.value; 
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
            type: 'GET',
            url: 'https://ot-node-rest-api.onrender.com/products/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId; 
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
            type: 'POST',
            description: 'Create a new product',
            url: 'https://ot-node-rest-api.onrender.com/products',
            body: { name: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

