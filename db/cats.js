const {client} = require("./client");

async function createCats({name, breed, age, temperament, outdoor, adoptionFee, imageURL}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO cats(name, breed, age, temperament, outdoor, "adoptionFee", "imageURL")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `,[name, breed, age, temperament, outdoor, adoptionFee, imageURL]);

        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function getAllCats() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM cats;
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}


async function deleteCatById(id) {
    try {
      const deletedCat = await db.query(`DELETE FROM cats WHERE id=$1 RETURNING *`, [id]);
      return deletedCat.rowCount;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

module.exports = {
   createCats, getAllCats, deleteCatById
}