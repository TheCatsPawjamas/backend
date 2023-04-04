const express = require("express")

const {
    addCatsToOrder, 
    getPurchasesById,
    updatePurchases, 
    deletePurchases
} = require("../db/purchases");
const { getUserById } = require("../db/users");

const purchasesRouter = express.Router();

purchasesRouter.get("/:id", async (req, res) => {
    const id = req.body.id 
    const purchases = await getPurchasesById(id)

    if (!purchases) {
        res.status(404).json({
            message: `Purchase with that id ${id} not found`
        })
    } else {
        res.json(purchases)
    }
})

purchasesRouter.patch("/:id", async (req, res) => {
    const {id} = req.params.id 
    const { creditCardName, creditCard, creditCardCVC, creditCardExpirationDate} = req.body

    const user = await getUserById(id)
    if (user) {
        let updateFields = {};
        if (creditCardName) {
            updateFields.creditCardName = creditCardName
        }
        if (creditCard) {
            updateFields.creditCard = creditCard
        }
        if (creditCardCVC) {
            updateFields.creditCardCVC = creditCardCVC
        } 
        if (creditCardExpirationDate) {
            updateFields.creditCardExpirationDate = creditCardExpirationDate
        } 
        try {
            const updatedPurchase = await updatedPurchases({fields: updateFields});
            console.log("starting to update purchase")
            res.send(updatedPurchase).status(200)
        } catch (error) {
            res.send(error).status(500)
        }
    } else {
        res.send({
            success: false, 
            error: {
                name: "Invalid User",
                message: "Cannot update purchase at this time"
            },
        })
    }
})

// try { 
//     const newUpdatedPurchases = await updatePurchases({
//         id, 
//         creditCardName, 
//         creditCard, 
//         creditCardCVC, 
//         creditCardExpirationDate
//     })

//     if(newUpdatedPurchases.length == 0) {
//         res.status(404).json({ 
//             message: `Purchase with that id ${id} was not found` 
//         });
//     } else {
//         res.json(newUpdatedPurchases[0])
//     }
// } catch (error) {
//     console.log(error)
//     res.status(500).json({
//         message: "Internal Server Error"
//     })
// }

purchasesRouter.delete("/:id", async (req, res) => {
    const id = req.params 

    try {
        const destroyPurchase = await deletePurchases(id)
        res.send({
            success: true,
            destroyPurchase
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = purchasesRouter