const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/config')();
const db = require('./models/index');

async function dbConnnect() {
    await db.sequelize.sync();
};

dbConnnect();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;