require('dotenv').config();
const { Client } = require('pg');
// const connection = process.env.DATABASE_URL || 'postgres://localhost:5432/TheCatsPawjamas'
const connection = 'postgres://localhost:5432/TheCatsPawjamas'
const client = new Client(connection);
// client.password = process.env.RENDER_PASSWORD;

module.exports = {
    client
}