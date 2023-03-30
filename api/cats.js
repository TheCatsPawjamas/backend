const express = require('express');
const { requireUser } = require('./utils');
const { createCats } = require("../db/index"); 
const { getAllCats } = require("../db/index");
const { deleteCatById } = require("../db/index");

const cats = express.Router();
  

// GET /api/cats
cats.get('/', async (req, res) => {
    try {
        console.log("Starting to fetch cats")
        const allCats = await getAllCats();
        console.log("Finished fetching cats")
        res.send(allCats)
    } catch (error) {
        console.log(error)
    }
})


// POST /api/cats
cats.post('/cats', async (req, res) => {
    try {
      const { name, breed, age, temperament, outdoor, adoptionFee, imageURL } = req.body;
      const newCat = await createCats({ name, breed, age, temperament, outdoor, adoptionFee, imageURL });
      res.send(newCat);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// PATCH /api/cats/:catId
cats.patch('/cats/:catId', async (req, res) => {
    try {
      const id = req.params.id;
      const { name, breed, age, temperament, outdoor, adoptionFee, imageURL } = req.body;
      const updatedCat = await updateActivity({ id, name, breed, age, temperament, outdoor, adoptionFee, imageURL });
      if (updatedCat.length === 0) {
        res.status(404).json({ message: `Cat with id ${id} not found` });
      } else {
        res.json(updatedCat[0]);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// DELETE /api/cats/:catId
cats.delete('/cats/:catId', requireUser, async (req, res) => {
    try {
      const id = req.params.catId;
      const deletedCat = await deleteCatById(id);
      if (deletedCat === 0) {
        res.status(404).json({ message: `Cat with id ${id} not found` });
      } else {
        res.json({ message: `Cat with id ${id} deleted successfully` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  
module.exports = cats;