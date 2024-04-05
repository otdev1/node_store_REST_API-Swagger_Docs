const express = require('express');
const router = express.Router(); //see https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = require("../models/userModel");

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         email: newuser@retailshop.com
 *         password: p4ssw0rd
 *     LoggedInUser:
 *       type: object
 *       properties:
 *          success_message:
 *             type: string
 *          token:
 *             type: string
 *             description: A 211-character JSON web token i.e. bearer auth token 
 *          userData:
 *             type: object
 *             properties:
 *                id:
 *                   type: string
 *                   description: The auto-generated id of the user
 *                email:
 *                   type: string
 *                   description: The user's email address
 *     RegisteredUser:
 *       type: object
 *       properties:
 *          success_message:
 *             type: string 
 *          userData:
 *             type: object
 *             properties:
 *                id:
 *                   type: string
 *                   description: The auto-generated id of the user
 *                email:
 *                   type: string
 *                   description: The user's email address
 *
 */

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: All user-related operations
  */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Registration Successful. See the RegisteredUser schema
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/RegisteredUser'   
 *       500:
 *         description: Some server error
 */

router.post("/signup", UserController.user_signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login as an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Login Successful. See the LoggedInUser schema
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LoggedInUser'
 *       500:
 *         description: Some server error
 */
router.post("/login", UserController.user_login);

/** 
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: User removed
 *       404:
 *         description: The user was not found
 */
router.delete("/:userId", UserController.user_delete);

module.exports = router;