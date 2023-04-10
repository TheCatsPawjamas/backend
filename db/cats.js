const {client} = require("./client");

async function createCats({name, breed, age, temperament, outdoor, adoptionFee, imageURL}) {
    try {
        console.log("This is the image URL: " + imageURL);
        const {rows} = await client.query(`
        INSERT INTO cats(name, breed, age, temperament, outdoor, "adoptionFee", "imageURL")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
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


async function getCatById(id){
    try {
        const {rows: [cat] } =  await client.query(`
        SELECT * FROM cats
        WHERE id = $1;
        `,[id])

        return cat;
    } catch (error) {
        console.log(error);
    }
}


async function updateCat({ id, fields= {} }) {
  
      const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
  
      if(setString.length ===0){
          return
      }
  
      try {
          const { rows: [ cat ] } = await client.query(`
          UPDATE cats
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(fields));
    
        return cat;
  
      } catch (error) {
          console.log(error);
      }
  }


async function deleteCatById(id) {
    try {

        await client.query(`
            DELETE FROM purchases
            WHERE "catId"=$1;
        `,[id])

      const deletedCat = await client.query(`DELETE FROM cats WHERE id=$1 RETURNING *;`, [id]);
      return deletedCat.rowCount;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

module.exports = {
   createCats, getAllCats, getCatById, updateCat, deleteCatById
}