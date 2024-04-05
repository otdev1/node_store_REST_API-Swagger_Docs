const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    /*the product key is set to an object, the produt key specifies which product was ordered
      ref connects the current model in this case Order to another model in this case Product 
      required is used to ensure that product id is passed
    */
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);