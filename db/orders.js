const {client} = require("./client");

async function createOrders({userId, creditCardName, creditCard, creditCardExpirationDate, creditCardCVC, status}){
    try {
        const {rows} = await client.query(`
        INSERT INTO routines("userId", "creditCardName, creditCard, creditCardExpirationDate, creditCardCVC, Status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [userId, creditCardName, creditCard, creditCardExpirationDate, creditCardCVC, status])

        if (!rows) return undefined 
        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getOrders() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM routines;
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createOrders, 
    getOrders
}