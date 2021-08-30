const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Member } = require('../models/member');
const router = express.Router();


router.post('/', async (req, res) => {
    try{
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let member = await Member.findOne({ email: req.body.email });
        if (!member) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, member.password);

        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = member.generateAuthToken();

        return res.send(token);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(req);
}

module.exports = router;