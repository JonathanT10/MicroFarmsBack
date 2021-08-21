const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlenght: 150 },
    description: { type: String, required: true, minlength: 5, maxlength:  1255 },
    price: { type: String, required: true, minlength: 2},
    img: { data: Buffer, contentType: String },
    category: { type: String },
});


const Product = mongoose.model('Product', productSchema);;

exports.Product = Product;