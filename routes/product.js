const { Product } = require('../models/product');
 const express = require('express');
 const router = express.Router();
 const multer = require('multer');

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null,false);
    }
}

const upload = multer({
   storage: storage,
   limits: {
       fileSize: 1024 * 1024 * 5
   },
   fileFilter: fileFilter
});



//get a product from ID
router.get('/', async (req, res) => {
    try{
         const product = await Product.find();

         if (!product)
         return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);
         return res.send(product);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get a product from ID
router.get('/:id', async (req, res) => {
    try{
         const product = await Product.findById(req.params.id);

         if (!product)
         return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);
         return res.send(product);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})


//create new product
router.post('/', async (req, res) => {
    try{
       const product = new Product({
           name: req.body.name,
           description: req.body.description,
           price: req.body.price,
       });

       await product.save();

       return res.send(product);
    } catch (ex) {
        return res.status(550).send(`Internal Server Error: ${ex}`);
    }
})


// upload a product image
router.put("/uploadmulter/:id", upload.single('img'), async (req, res) => {
    try{
     const product = await Product.findByIdAndUpdate(req.params.id, {img: req.file.path});
     if (!product)
     return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);
 
     console.log(product);
 
     await product.save();
     return res.send(product);
 } catch (ex) {
     return res.status(500).send(`Internal Server Error: ${ex}`);
 }
 });


 module.exports = router;