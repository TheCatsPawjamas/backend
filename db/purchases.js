const {client} = require("./client");

//This function takes catId, orderId, and adoptionFee and puts them into one join table.
async function addCatsToOrders({
    catId,
    orderId,
    adoptionFee
}) {
    try {
        const {rows: [purchases]} = await client.query(`
        INSERT INTO purchases("catId", "orderId", "adoptionFee")
        VALUES ($1, $2, $3)
        RETURNING *;
        `, [catId, orderId, adoptionFee])     
        return purchases;
    } catch (error) {
        console.log(error);
    }
}


module.exports = addCatsToOrders


