const { Member } = require('../models/member');
 const { validate } = require('../models/member');
 const bcrypt = require('bcrypt');
 const express = require('express');
 const router = express.Router();
 const auth = require('../middleware/auth');

 

//post a new member
router.post('/', async (req, res) => {
    try{
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let member = await Member.findOne({ email: req.body.email });
        if (member) return res.status(400).send(`Patron already registered.`);

        const salt = await bcrypt.genSalt(10);
        member = new Member({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });

        await member.save();

        const token = member.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({ _id: member._id, name: member.name, email: member.email });
}catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
}
});

//get a member from ID
router.get('/:id', async (req, res) => {
    try{
         const member = await Member.findById(req.params.id);

         if (!member)
         return res.status(400).send(`The member with ID: ${req.params.id} does not exist`);
         return res.send(member);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get a member and return only a couple variables
router.get('/', async (req, res) => {
    try {
        const member = await User.find()
            .select({ _id: 1, name: 1, email: 1 })
            return res.send(member);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
}); 

// add cart to cart of a member
router.put('/:id/cart', auth, async (req, res) => {
    try{
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            {
                cart: [req.body.name,
                       req.body.description,
                       req.body.addressMade,
                       req.body.price,
                       req.body.merchantId
                ],
            },
            { new: true }
        );

        if (!member)
        return res.status(400).send(`The member with ID: ${req.params.id} does not exist`);

        await member.save();

        return res.send(member.cart);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// empty cart
router.put('/:id/empty', async (req, res) => {
    try{
        const member = await Member.findById(req.params.id);
    if (!member)
        return res.status(400).send(`The member with ID: ${req.params.id} does not exist`);
        member.cart.splice(0,member.cart.length)
        await member.save();

        return res.send(member.cart);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// add cart to pastOrders of a member
router.put('/:id/pastorders', async (req, res) => {
    try{
        const member = await Member.findById(req.params.id);
    if (!member)
        return res.status(400).send(`The member with ID: ${req.params.id} does not exist`);
        member.pastOrders.push(member.cart)
        await member.save();

        return res.send(member.pastOrders);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/:memberId/cart/:productId', async (req, res) => {
    try{
        const member = await Member.findById(req.params.memberId);
        if(!member) return res.status(400).send(`The member with id "${req.params.patronId}"does not exist.`);

        const product = await Product .findById(req.params.productId);
        if(!product) return res.status(400).send(`The product with id "${req.params.productId}" does not exist.`);

        member.cart.push(product);
        await member.save();
        return res.send(member.cart);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//place to store past orders
router.put('/:id/pastorders', auth, async (req, res) => {
    try{
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            {
                pastOrders: [req.body.pastOrders],
            },
            { new: true }
        );

        if (!member)
        return res.status(400).send(`The member with ID: ${req.params.id} does not exist`);

        await member.save();

        return res.send(member);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});




module.exports = router;

