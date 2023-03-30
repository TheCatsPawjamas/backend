const {client} = require("./client");


const {createUser} = require('./users');
const {createCats, getAllCats} = require('./cats');
const {createOrders, getOrders} = require('./orders');
const {addCatsToOrders} = require('./purchases');

async function dropTables(){
    try {
        console.log("Dropping all tables...");
        await client.query(`
            DROP TABLE IF EXISTS purchases;
            DROP TABLE IF EXISTS cats;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS users;
            
        `);
    console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables");
        throw error;
    }
    
}


async function createTables(){
    try {
        console.log("Starting to build tables...")
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                admin BOOLEAN DEFAULT false
            
            );
            CREATE TABLE orders(
                id SERIAL PRIMARY KEY,
                "userId" INT REFERENCES users(id),
                "creditCardName" VARCHAR(255) NOT NULL,
                "creditCard" VARCHAR(255) UNIQUE NOT NULL,
                "creditCardExprDate" VARCHAR(255) NOT NULL,
                "creditCardCVC" VARCHAR(4) NOT NULL,
                status VARCHAR(255) DEFAULT 'pending'
            
            );
            CREATE TABLE cats(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) DEFAULT 'Sir. Pounce',
                breed VARCHAR(255),
                age VARCHAR(255) NOT NULL,
                temperment VARCHAR(255),
                outdoor BOOLEAN DEFAULT false,
                "adoptionFee" INT DEFAULT 100,
                "imageURL" TEXT NOT NULL
            );
            CREATE TABLE purchases(
                id SERIAL PRIMARY KEY,
                "catId" INT REFERENCES cats(id),
                "orderId" INT REFERENCES orders(id),
                "adoptionFee" INT DEFAULT 100
            );
            `);
        console.log("Finished building tables");
        
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }

}

// CREATE INITIAL VALUES BELOW

async function createInitialUsers() {
    console.log("Starting to create users...")
    try {
      const usersToCreate = [
        { username: "albert", password: "bertie99", email: "albert123@gmail.com" },
        { username: "sandra", password: "sandra123", email: "sandra456@hotmail.com" },
        { username: "glamgal", password: "glamgal123", email: "glamgaloo@yahoo.com" },
      ]
      const users = await Promise.all(usersToCreate.map(createUser))
  
      console.log("Users created:")
      console.log(users)
      console.log("Finished creating users!")
    } catch (error) {
      console.error("Error creating users!")
      throw error
    }
  }
  async function createInitialCats() {
    try {
      console.log("Starting to create cats...")
  
      const catsToCreate = [
        {
            name: "Cleo",
            breed: "Sphynx",
            age: "3",
            temperament: "Sassy and Energetic",
            outdoor: false,
            adoptionFee: 500,
            imageUrl: ""
        },
        {
            name: "Puss in Boots",
            breed: "Golden British shorthair",
            age: "20",
            temperament: "Proud and Honorable",
            outdoor: true,
            adoptionFee: 10000,
            imageUrl: ""
        },
        {
            name: "Biscuit",
            breed: "American longhair",
            age: "10",
            temperament: "Smart and Independent",
            outdoor: false,
            adoptionFee: 200,
            imageUrl: ""
        },
        { 
            name: "Henry",
            breed: "Munchkin Cat",
            age: "2",
            temperament: "Fuzzy and Playful",
            outdoor: false,
            adoptionFee: 350,
            imageUrl: ""
        },
        {
            name: "Annie",
            breed: "Ragdoll",
            age: "7",
            temperament: "Cuddly and Playful",
            outdoor: false,
            adoptionFee: 600,
            imageUrl: ""   
        }

      ]
      const cats = await Promise.all(catsToCreate.map(createCats))
  
      console.log("Catss created:")
      console.log(cats)
  
      console.log("Finished creating cats!")
    } catch (error) {
      console.error("Error creating cats!")
      throw error
    }
  }
  
  async function createInitialOrders() {
    console.log("starting to create orders...")
  
    const ordersToCreate = [
      {
        userId: 1,
        creditCardName: "Albert Bertie",
        creditCard: "123456789012345",
        creditCardExpirationDate: "01/25",
        creditCardCVC: "1234",
        status: "pending"
        
      },
      {
        userId: 2,
        creditCardName: "Sandra Bullock",
        creditCard: "39053290581903",
        creditCardExpirationDate: "10/23",
        creditCardCVC: "787",
        status: "pending"
      },
      {
        userId: 1,
        creditCardName: "Glamgal Gabagool",
        creditCard: "23701748701247",
        creditCardExpirationDate: "04/26",
        creditCardCVC: "098",
        status: "pending"
      },
    ]
    const orders = await Promise.all(
      ordersToCreate.map((orders) => createOrders(orders))
    )
    console.log("Orders Created: ", orders)
    console.log("Finished creating orders.")
  }
  
  //catId, orderId, adoptionFee
  async function createInitialPurchases() {
    console.log("starting to create purchases...")
    const [order1, order2, order3] =
      await getOrders()
    const [cat1, cat2, cat3, cat4, cat5] =
      await getAllCats()
  
    const purchasesToCreate = [
      {
        catId: cat1.id,
        orderId: order1.id,
        adoptionFee: 500,
      },
      {
        catId: cat2.id,
        orderId: order1.id,
        adoptionFee: 10000,
      },
      {
        catId: cat3.id,
        orderId: order2.id,
        adoptionFee: 200,
      }
    ]
    const purchases = await Promise.all(
      purchasesToCreate.map(addCatsToOrders)
    )
    console.log("purchases created: ", purchases)
    console.log("Finished creating purchases!")
  }
  
  async function rebuildDB() {
    try {
      client.connect();
      await dropTables()
      await createTables()
      await createInitialUsers()
      await createInitialCats()
      await createInitialOrders()
      await createInitialPurchases()
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }
  
  module.exports = {
    rebuildDB,
    dropTables,
    createTables,
  }
