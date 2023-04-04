const express = require("express");
const { getAllOrders, createOrders, updateOrders, destroyOrders, finishOrder } = require("../db/orders");

const ordersRouter = express.Router();

const {requireUser} = require('./utils');

const {
    getOrders,
    getAllOrdersByUser,
    createOrders,
    addCatsToOrders
} = require('../db');

//get all orders- done
//get your orders - done
//create an order - done
//add cats to your orders - done
//update your order - done
//MAYBE DO THIS: add credit card information to a user
    //its done in update your order but maybe needs to be done
//delete items from your cart - done
//finish an order => 
    //update order and set status to submitted, 
    //make a new order for that user

ordersRouter.get('/', async (req, res, next) => {
    try {
        let allOrders = await getOrders();
        console.log(allOrders);
        res.send(allOrders);
    } catch(error) {
        console.log(error)
    }
})

ordersRouter.get('/:id', async (req,res,next)=>{
    const id = req.params.id;
    console.log(id);
    try {
        const myOrders = await getAllOrdersByUser(id);
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

//user is already assigned an order on account creation, this is redundant.
// ordersRouter.post('/', requireUser ,async (req, res, next) => {
//     const { creditCardName, creditCard, creditCardExpirationDate,creditCardCVC } = req.body;
//     const orderData = {};
//     const user = req.user;
//     try{
//         if(user){
//             const ordersToCreate = await createOrders({
//                 creditCardName,
//                 creditCard,
//                 creditCardExpirationDate,
//                 creditCardCVC
//             });
    
//             res.send(
//                 ordersToCreate
//             );
//         }
//         else{
//             res.send({
//                 name: "MissingUserData",
//                 message: "must be signed in to perform this action"
//             })
//         }
//     } catch ({ name, message }) {
//         next({ name, message })
//     } 
// });

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

//no reason to delete an order. delete a cat from an order instead
ordersRouter.delete('/:orderId/:catId', requireUser, async(req,res,next)=>{
    const id = req.params.id;
    const user = req.user;

    //delete from purchases where catId=$1 and orderId=$2;

    try {
        if(user){
            const deletedOrder = await destroyOrders(id);
            res.send(deletedOrder);
        }else{
            res.send({
                name: "MissingUserData",
                message: "must be signed in to perform this action"
            });
        }  
    } catch (error) {
        console.log(error);
        throw error;
    }
})

ordersRouter.post('/purchase', requireUser, async(req,res,next)=>{
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


