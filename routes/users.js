const auth = require('../middleware/auth');
const { validate } = require('../startup/tokenValidation');
const Users = require('../controllers').users;
const {User} = require('../models');
const express = require('express');
const router = express.Router();

router.get('/me', auth , async(req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
  res.send(user);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ where: { email: req.body.email } });
    if(user) return res.status(400).send('User already registered.');

    await Users.create(req, res);
    
});

module.exports = router;