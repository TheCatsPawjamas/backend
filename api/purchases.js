const express = require("express")

const {
    addCatsToOrder, 
    getPurchasesById,
    updatePurchases, 
    deletePurchases
} = require("../db/purchases")

const purchasesRouter = express.Router();

purchasesRouter.get("/:id", async (req, res) => {
    const id = req.body.id 
    const purchase = await getPurchasesById(id)

    if (!purchases) {
        res.status(404).json({
            message: `Purchase with that id ${id} not found`
        })
    } else {
        res.json(purchases)
    }
})

purchasesRouter.patch("/:id", async (req, res) => {
    const id = req.params.id 
    const { creditCardName, creditCard, creditCardCVC, creditCardExpirationDate} = req.body

    try { 
        const newUpdatedPurchases = await updatePurchases({
            id, 
            creditCardName, 
            creditCard, 
            creditCardCVC, 
            creditCardExpirationDate
        })

        if(newUpdatedPurchases.length == 0) {
            res.status(404).json({ 
                message: `Routine Activity with id ${id} not found` 
            });
        } else {
            res.json(newUpdatedPurchases[0])
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

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