const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const User = require("../models/userModel");

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          bcrypt.compare(req.body.password, user[0].password, (err, result) => {
              if (err) {
                return res.status(401).json({
                  message: "Auth failed"
                });
              }
              if (result) {
                const token = jwt.sign(
                  {
                    email: user[0].email,
                    userId: user[0]._id
                  },
                  process.env.JWT_KEY,
                  {
                      expiresIn: "1h"
                  }
                ); 
                return res.status(200).json({
                  message: "Auth successful",
                  token: token,
                  userData: {
                    _id: user[0]._id,
                    email: user[0].email
                  }
                });
              }
              res.status(401).json({
                message: "Auth failed"
              });
            });
        }
        else
        {
            return res.status(401).json({
                message: "Auth failed"
              });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => { 
    if (user.length >= 1) {
      return res.status(409).json({ 
        message: "User already exists"
      });
    } 
    else {
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
                      message: "User created",
                      userData: {
                        _id: result._id,
                        email: result.email
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
          });
      }
  })
}

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User removed"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}
