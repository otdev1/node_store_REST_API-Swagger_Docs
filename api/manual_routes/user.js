const express = require('express');
const router = express.Router(); //see https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = require("../models/userModel");

router.post("/signup", (req, res, next) => {
    /*const User = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email ,
        //password: req.body.password
        password: bcrypt.hash(req.body.password, 10, ) 
        /*10 salting rounds i.e random text strings are added to password to prevent 
        original password from being discovered by looking up a hash dictionary table

    });*/
    //password hashing is done first before a new user is created instruction execution is more logically accurate
   
    User.find({ email: req.body.email })
    .exec()
    .then(user => { 
      /*prevents a user from being created with an email that already exists
      node that user is an array*/
      if (user.length >= 1) {
        return res.status(409).json({ //status code 409 means conflict
          message: "Mail exists"
        });
      } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                    error: err
                    });
                } else {
                    const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                        message: "User created"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                        error: err
                        });
                    });
                }
            });
        }
    });

    router.post("/login", (req, res, next) => {
        User.find({ email: req.body.email })
        //find returns an array where as findOne returns 1 object(document) 
          .exec()
          .then(user => {
            if (user.length < 1) {
              return res.status(401).json({
                message: "Auth failed"
              });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            /*checks if the password in the body and the stored password were hased using the same
              algorithm in bcrypt
              user[0] is the first element i.e user object(document) in the user array and
              and as defined in the model password is a property of the user document */
              if (err) {
                return res.status(401).json({
                  message: "Auth failed"
                });
              }
              if (result) { /*bcrypt.compare returns either true or false see https://www.npmjs.com/package/bcrypt*/
                const token = jwt.sign( //see usage on https://github.com/auth0/node-jsonwebtoken
                  //payload
                  {
                    email: user[0].email,
                    userId: user[0]._id
                  },
                  //secretorprivatekey
                  process.env.JWT_KEY, // see nodemon.json file
                  {
                      expiresIn: "1h" //jwt key expires in 1 hour
                  }
                ); /*the sign function accepts payload and secretorprivatekey as arguments and generates 
                   a token i.e string of characters which can be used for authentication of routes*/
                return res.status(200).json({
                  message: "Auth successful",
                  token: token
                });
              }
              res.status(401).json({
                message: "Auth failed"
              });
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      });

    router.delete("/:userId", (req, res, next) => {
        User.remove({ _id: req.params.userId })
          .exec()
          .then(result => {
            res.status(200).json({
              message: "User deleted"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      });

});

module.exports = router;