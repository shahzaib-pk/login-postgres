const Joi = require('joi');
const {User} = require('../models');
const { generateAuthToken, generateRefreshToken } = require('../startup/tokenValidation');
const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

router.post('/', validate(validateAuth), async (req, res) => {    
    let user = await User.findOne({ where: { email: req.body.email } });
    if(!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = generateAuthToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.send({jwtToken: token, refreshToken: refreshToken});
});

router.post('/refresh-token', async (req, res) => {   

  try {
    const refreshToken = req.header('x-refresh-token');
    if(!refreshToken) return res.status(401).send('No token provided.');

    const payload = jwt.verify(refreshToken, config.get('jwtRefreshKey'));
    const token = generateAuthToken(payload.id);
    res.send({jwtToken: token});
  } 
  catch (error) {
    res.status(400).send('Invalid token.')
  }

});

function validateAuth(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
}

module.exports = router;