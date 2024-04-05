const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

require('dotenv').config()

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://nrs-admin:"+ process.env.MONGO_ATLAS_PW +"@node-rest-shop-hbzsi.mongodb.net/restapi-db?retryWrites=true", { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELET, GET');
        return res.status(200).json({});
    }
    next();
});

const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Retail Store REST API",
			version: "1.0.0",
			description: "A simple retail shop REST API. It is recommended that you first register/login(see the the user-related operations below) to fully experience the capabilities of this API",
		},
		servers: [
			{
			    //url: "PLACE SERVER URL HERE"
			},
		],
	},
	apis: ["./api/routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found'); 
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;
