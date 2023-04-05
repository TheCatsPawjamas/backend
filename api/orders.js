const express = require("express");
const { 
    getOrdersById,
    updateOrders, destroyOrders, finishOrder, getEntireCartByUserId } = require("../db/orders");

const ordersRouter = express.Router();


const {requireUser} = require('./utils');

const {
    getOrders,
    getAllOrdersByUser,
    createOrders,
    addCatsToOrders
} = require('../db');

//gets all orders, this should be an admin function... will work on it for the next code review
ordersRouter.get('/', async (req, res, next) => {
    try {
        let allOrders = await getOrders();
        console.log(allOrders);
        res.send(allOrders);
    } catch(error) {
        console.log(error)
    }
})

//gets your specific order by the id primary key of the orders table AND all the cats associated with that order
ordersRouter.get('/:id', requireUser,async (req,res,next)=>{
    const id = req.params.id;
    console.log(id);
    const user = req.user;
    const userId = user[0].id
    console.log(user);
    console.log(userId);
    try {
        const myOrders = await getOrdersById(id);
        console.log("this is myOrders variable");
        console.log(myOrders);
        if(myOrders){
            res.send(myOrders).status(200);
        }
        else{
            res.send({
                name: "Missing orders",
                message: "must create an order to see it"
            }).status(204);
        }   
    } catch (error) {
        console.log(error);
        throw error;
    }
})

//Adds a cat to a specific order by the orderId, have to input the catId, orderId, and adoptionFee
ordersRouter.post('/:orderId/cats', async (req, res, next) => {
    const orderId = req.params.orderId;
    const { catId, adoptionFee } = req.body;
    try {
         
        const addCatToOrder = await addCatsToOrders({ catId, orderId, adoptionFee });

        if (addCatToOrder) {
            res.send(addCatToOrder).status(200);
        } else {
            res.send(error);
        };
    } catch (error) {
        console.log(error)
    }
})

//adds credit card information to an order, these variables always default to false...
//should be used in the payments page on the frontend that Aamna was working on
ordersRouter.patch('/:id',requireUser, async (req,res,next)=>{
    const id = req.params.id;
    const user = req.user;
    const { creditCardName, creditCard, creditCardExpirationDate,creditCardCVC } = req.body;
    const orderData = {};
    if(creditCardName){
        orderData.creditCardName = creditCardName;
    }
    if(creditCard){
        orderData.creditCard = creditCard;
    }
    if(creditCardExpirationDate){
        orderData.creditCardExpirationDate=creditCardExpirationDate;
    }
    if(creditCardCVC){
        orderData.creditCardCVC = creditCardCVC;
    }

    try {
        if(user){
            const updatedOrder = await updateOrders({id, fields : orderData});
            res.send(updatedOrder);
        }
        
    } catch (error) {
        console.log(error);
        throw error;
    }
})



//getAllPurchasesByUserId -> get every single order for that user's cart
//gets all the purchases in the purchases table by a user's Id. outputs catId, orderId, and adoptionFee
ordersRouter.get('/:userId/cart', requireUser, async(req,res,next)=>{
    const user = req.user;

    const userId = req.body.userId;
    const id = user[0].id;
    try {
        if(user){
            const myCart=await getEntireCartByUserId(id);
            res.send(myCart);
        }

    } catch (error) {
        console.log(error);
        throw error;
    }

})


//finish the entire purchase
//for frontend, don't include a body at all
//sets the status for a order/cart as submitted and creates a new cart for that user
ordersRouter.post('/purchase', requireUser, async(req,res,next)=>{
    const user = req.user;
    const userId = user[0].id;

    try {
        if(user){
            const orderToBeCompleted = await finishOrder(userId);
            
            res.send(orderToBeCompleted);

        }else{
            res.send({
                name: "MissingUserData",
                message: "must be signed in to perform this action"
            })
        }
        
    } catch (error) {
        console.log(error);
        throw error;
    }
})


module.exports = ordersRouter;
