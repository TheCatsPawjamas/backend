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

// in order to build the delete function, acquire purchaseById
async function getPurchasesById(id){ 
    try {
        const {rows} = await client.query(`
        SELECT * FROM "purchases"
        WHERE id = $1; 
        `,[id])

        return rows[0]
    } catch (error) {
        console.log(error)
    }
}
async function getPurchasesByCatId(catId){ 
    try {
        const {rows} = await client.query(`
        SELECT * FROM "purchases"
        WHERE "catId" = $1; 
        `,[catId])

        return rows[0]
    } catch (error) {
        console.log(error)
    }
}
// delete a purchase 
async function deletePurchases(catId, orderId) {
    try {
        const removePurchase = await getPurchasesByCatId(catId)
        client.query(`
        DELETE FROM "purchases"
        WHERE "catId" = ${catId}
        AND "orderId"=${orderId};
        `)

        return removePurchase;
    } catch (error) {
        console.log(error)
    }
}

//update purchase - way not need this
async function updatePurchases({ id, fields={}}) {
    const string = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    try { 
        const {rows: [purchases]} = await client.query(`
        UPDATE "purchases"
        SET ${ string }
        WHERE id = ${id}
        RETURNING *; 
        `, Object.values(fields)) 

        return purchases
    } catch (error) {
        console.log(error)
    }
}
    
module.exports = {
    addCatsToOrders,
    deletePurchases, 
    updatePurchases,
    getPurchasesById
}

