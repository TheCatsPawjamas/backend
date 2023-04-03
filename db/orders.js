const {client} = require("./client")
// push later on

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
        const { rows: [orders] } = await client.query(`
        SELECT orders.* FROM orders
        WHERE orders.id =$1
        `[id])

        if (!orders) return undefined

        const {rows: cats} = await client.query(`
        SELECT cats.* FROM cats
        JOIN purchases on purchases."catId" = cat.id
        WHERE purchases."catId" = $1;
        `,[id])

        orders.cats = orders
        return orders
    } catch (error) {
        console.log(error)
    }
}

async function getAllOrders() {
    try{
        const {rows: ids} = await client.queary(`
        SELECT id FROM orders;
        `)

        const orders = await Promise.all(ids.map(
            orders => getOrdersById(orders.id)
        ))
        return 
    } catch {
        console.log(error)
    }
}
// what about getAllPendingOrders() 

async function getAllOrdersByUser(id) {
    try {
    const {rows: ids} = await client.queary(`
    SELECT id FROM orders
    WHERE "userId" = $1;
    `[id])

    const orders = await Promise.all(ids.map(
        orders => getOrdersById(orders.id)
    ))
    return orders;
    } catch (error) {
        console.log(error)
    }
}

// getAllPendingOrdersByUser
//getAllPurchasesByUser in purchases

// async function attachActivitiesToRoutines(routines) {
//     try {
//         console.log(routines)
//         const {rows} = await client.query(`
//             SELECT * from activities
//             JOIN "RoutineActivities"
//             ON activities.id = "RoutineActivities"."activityId";
//         `);
//         console.log("This is routines in attachActivitiesToRoutines function");
//         console.log(routines)
//         for(let i=0; i<routines.length; i++){
//             let answer = rows.filter((singleActivity)=>{
//                 if(singleActivity.routineId == routines[i].id){
//                     return true;
//                 }else{
//                     return false;
//                 }
//             })
//             routines[i].activities = answer;
//         }
//         return routines;
//     } catch (error) {
//         console.log(error);
//     }
// }


// getAllPendigOrdersByCats

// if we have an error - use talal's code 
async function updateOrders ({userId, creditCardName, creditCard, creditCardExpirationDate, creditCardCVC, status}){
    try {
        const {rows} = await client.query(`
        UPDATE orders
        SET "creditCardName" = $1, 
        "creditCard" = $2, 
        "creditCardExpirationDate" = $3, 
        "creditCardCVC" = $4, 
        "creditCardCVC" = $5, 
        status = $6
        WHERE userId = ${userId}
        RETURNING *;
        `,[
        userId, 
        creditCardName, 
        creditCard, 
        creditCardExpirationDate, 
        creditCardCVC, 
        status])

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function destroyOrders(id) {
    try { 
        const destroyOrders = await getOrdersById(id) 

        await client.query(`
        DELETE FROM orders
        WHERE id = $1;
        `[id])

        client.query(`
        DELETE FROM purchases
        WHERE "orderId" = $1
        `,[id])

        return destroyOrders;
    } catch (error) {
        console.log(error)
    }
}
//submitOrder function to take in a userId and make their order status=submitted, 
//creates a new order for them with status=pending
//getuserbyId

//delete a purchase
//maybe: update a purchase

module.exports = {
    createOrders, 
    getOrders,
    getAllOrders,
    getAllOrdersByUser,
    updateOrders,
    destroyOrders
}