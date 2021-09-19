const User = require('../models').User;
const bcrypt = require('bcrypt');
const { generateAuthToken } = require('../startup/tokenValidation');
const _ = require('lodash');

async function hash(password){
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

module.exports = {
  async create(req, res) {
    return User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: await hash(req.body.password)
      })
      .then(user => { 
        const token = generateAuthToken(user.id);
        res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email'])); })
      .catch(error => res.status(400).send(error));
  },
};