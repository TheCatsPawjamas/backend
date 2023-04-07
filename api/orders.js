const express = require("express");
const { 
    getOrdersById,
    updateOrders, destroyOrders, finishOrder, getEntireCartByUserId, getPendingOrderByUserId,getOrderByUserId } = require("../db/orders");

const ordersRouter = express.Router();
const bcrypt = require('bcrypt');


const {requireUser} = require('./utils');

const {
    getOrders,
    getAllOrdersByUser,
    createOrders,
    addCatsToOrders,
    getCatById
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

//get a users pending order by userId    -> This is the new router
ordersRouter.get('/cart/:userId', requireUser, async(req,res,next)=>{
    const user=req.user;
    const userId = req.params.userId
    try {
        if(user){
            const myOrder = await getPendingOrderByUserId(userId);
            res.send(myOrder);
        }else{
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

//gets your specific order by the id primary key of the orders table AND the purchase ID for that cart AND all the cats associated with that order
ordersRouter.get('/:id', requireUser,async (req,res,next)=>{
    const id = req.params.id;
    console.log(id);
    const user = req.user;
    const userId = user.id
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

//Adds a cat to a specific order by the orderId, have to input the catId and adoptionFee
ordersRouter.post('/:orderId/cats',requireUser, async (req, res, next) => {
    const orderId = req.params.orderId;
    const { catId, adoptionFee } = req.body;
    const user = req.user;
    try {

        const addCatToOrder = await addCatsToOrders({ catId, orderId, adoptionFee });
        if(addCatToOrder){
            const theCatAdded = await getCatById(catId);
            if (theCatAdded) {
                res.send(theCatAdded).status(200);
            } else {
                res.send(error);
            };
        }


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
    let saltCount = 12;
    if(creditCardName){
        let hashedCardName = await bcrypt.hash(creditCardName,saltCount)
        orderData.creditCardName= hashedCardName;
        // orderData.creditCardName = creditCardName;
    }
    if(creditCard){
        let creditCardString = creditCard.toString();
        let hashedCardNum = await bcrypt.hash(creditCardString,saltCount);
        orderData.creditCard = hashedCardNum;
        // orderData.creditCard = creditCard;
    }
    if(creditCardExpirationDate){
        // let creditCardExpDateString = creditCardExpirationDate.toString
        let hashedCardDate = await bcrypt.hash(creditCardExpirationDate,saltCount);
        orderData.creditCardExpirationDate=hashedCardDate;
        // orderData.creditCardExpirationDate=creditCardExpirationDate;

    }
    if(creditCardCVC){
        let creditCardCVCString = creditCardCVC.toString();
        let hashedCardCVC = await bcrypt.hash(creditCardCVCString,saltCount);
        orderData.creditCardCVC = hashedCardCVC;
        // orderData.creditCardCVC = creditCardCVC;
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
    const id = user.id;
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
//sets the status for a order/cart as submitted and creates a new cart for that user with a new orderId
ordersRouter.post('/purchaseComplete', requireUser, async(req,res,next)=>{
    const user = req.user;
    const userId = user.id;

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
