const {client} = require("./client");
const { getPurchasesById } = require("./purchases");


async function createOrders({
    userId, 
    creditCardName, 
    creditCard, 
    creditCardExpirationDate, 
    creditCardCVC, 
    status}){
    try {
        const {rows} = await client.query(`
        INSERT INTO orders(
            "userId",
            "creditCardName", 
            "creditCard", 
            "creditCardExpirationDate", 
            "creditCardCVC", 
            status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `, [userId, creditCardName, creditCard, creditCardExpirationDate, creditCardCVC, status])

        if (!rows) return undefined 
        return rows;
    } catch (error) {
        console.log(error)
    }
}
async function createNewUserOrder({userId, status}){
    try {
        
        const {rows} = await client.query(`
        INSERT INTO orders("userId",status)
        VALUES ($1, $2)
        RETURNING *;
        `, [userId, status])


        if (!rows) return undefined 
        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getOrders() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM orders;
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}
async function getOrdersById(id) {
    try {
        const { rows: [order] } = await client.query(`
        SELECT * FROM orders
        WHERE orders.id=$1;
        `,[id])


        if (!Object.keys(order).length) return undefined

        const {rows} = await client.query(`
        SELECT cats.*, purchases.* FROM cats
        JOIN purchases on purchases."catId" = cats.id
        WHERE purchases."orderId" = $1;
        `,[id])

        order.cats = rows;
        return order
    } catch (error) {
        console.log(error)
    }
}



async function getAllOrdersByUser(userId) {
    try {

        
    const {rows} = await client.query(`
    SELECT * FROM orders
    WHERE "userId"=$1;
    `,[userId]);


    return rows;
    } catch (error) {
        console.log(error)
    }
}



async function updateOrders ({id, fields = {}}){
    
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length ===0){
        return
    }
    try {
        const {rows: [order]} = await client.query(`
        UPDATE orders
        SET ${setString}
        WHERE id = ${id}
        RETURNING *;
        `,Object.values(fields))

        return order;
    } catch (error) {
        console.log(error)
    }
}

async function destroyOrders(id) {
    try { 
        const destroyOrders = await getOrdersById(id) 

        await client.query(`
        DELETE FROM purchases
        WHERE "orderId" = $1
        `,[id])

        await client.query(`
        DELETE FROM orders
        WHERE id = $1;
        `[id])

        return destroyOrders;
    } catch (error) {
        console.log(error)
    }
}





//helper function
async function getPendingOrderByUserId(userId){
    try {

        const {rows} = await client.query(`
            SELECT * from orders
            WHERE "userId" = $1
            AND status='pending';
        `,[userId]);
        
 

       if(rows.length == 1)
       {
        return rows[0];
       }
       else if(rows)
       {
        return rows;
       }
       else
       {
        return undefined;
       }
        
       
    } catch (error) {
        console.log(error);
        throw error;
    }
}
//for profile page seeing all finished orders.
async function getAllFinishedOrdersByUserId(userId){
    try {
        
        const {rows} = await client.query(`
            SELECT * from orders
            WHERE "userId" = $1
            AND status='submitted';
        `,[userId]);
        
       if(rows.length == 1)
       {
        return rows[0];
       }
       else if(rows)
       {
        return rows;
       }
       else
       {
        return undefined;
       }
        
       
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getOrderByUserId(userId){
    try {
        const {rows} = await client.query(`
            SELECT * from orders
            WHERE "userId" = $1;
        `,[userId]);
        
       if(rows.length == 1)
       {
        return rows[0];
       }
       else if(rows)
       {
        return rows;
       }
       else
       {
        return undefined;
       }
        
       
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//new function. test functionality
async function getEntireCartByUserId(userId){
    try {
        const {rows} = await client.query(`
            SELECT p.id, p."catId", p."orderId", p."adoptionFee"
            FROM purchases p
            JOIN orders o ON p."orderId" = o.id
            WHERE o."userId" = $1;
        `,[userId]);

        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function finishOrder(userId){

    try {
        
        const order = await getOrderByUserId(userId);

        const {rows} = await client.query(`
            UPDATE orders
            SET status='submitted'
            WHERE "userId"=$1
            RETURNING *;
        `,[userId]);

        if(rows.length){
            await client.query(`
                INSERT INTO orders("userId")
                VALUES ($1)
                RETURNING *;
            `,[userId]);

        }else{
            return "Failed to Submit Order";
        }
        
        return order;


    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createOrders,
    createNewUserOrder, 
    getOrders,
    getOrdersById,
    getAllOrdersByUser,
    updateOrders,
    destroyOrders,
    getPendingOrderByUserId,
    finishOrder,
    getEntireCartByUserId,
    getOrderByUserId,
    getAllFinishedOrdersByUserId
}