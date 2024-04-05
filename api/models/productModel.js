const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //name: String,
    name: { type: String, required: true }, //prevents a product that doesn't have a value for the name property from being created
    //price: Number
    price: { type: Number, required: true}, //prevents a product that doesn't have a value for the price property from being created
    
    productImage: { type: String, required: false} 
    //type: String is used because the image/file URL will be stored in the database
    /*required: true means that the form must include an image in order to be submitted
    this behaviour is can obtional*/

});

module.exports = mongoose.model('Product', productSchema);
