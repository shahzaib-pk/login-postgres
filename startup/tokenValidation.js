const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

function generateAuthToken (userId) {
  const token = jwt.sign({ id: userId}, config.get('jwtPrivateKey'), { expiresIn: '15m' });
  return token;
}

function generateRefreshToken (userId) {
  const token = jwt.sign({ id: userId}, config.get('jwtRefreshKey'), { expiresIn: '5d' });
  return token;
}

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;
exports.generateRefreshToken = generateRefreshToken;