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
                "creditCardName" TEXT,
                "creditCard" TEXT UNIQUE,
                "creditCardExpirationDate" TEXT,
                "creditCardCVC" TEXT,
                status VARCHAR(255) DEFAULT 'pending'
            
            );
            CREATE TABLE cats(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) DEFAULT 'Sir. Pounce',
                breed VARCHAR(255),
                age VARCHAR(255) NOT NULL,
                temperament VARCHAR(255),
                outdoor BOOLEAN DEFAULT false,
                "adoptionFee" INT DEFAULT 100,
                "imageURL" TEXT
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
        { username: "albert", password: "bertie99", email: "albert123@gmail.com", admin: true },
        { username: "sandra", password: "sandra123", email: "sandra456@hotmail.com", admin: false },
        { username: "glamgal", password: "glamgal123", email: "glamgaloo@yahoo.com", admin: false },
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
            imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Sphynx_body_7.jpg?itok=dlFrsTiE"
        },
        {
            name: "Puss in Boots",
            breed: "Golden British shorthair",
            age: "20",
            temperament: "Proud and Honorable",
            outdoor: true,
            adoptionFee: 10000,
            imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC_noi0uPIq1iPf2668hGsqvl8kBh-_9ayIw&usqp=CAU"
        },
        {
            name: "Biscuit",
            breed: "American shorthair",
            age: "10",
            temperament: "Smart and Independent",
            outdoor: false,
            adoptionFee: 200,
            imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/AmericanShorthair_body_6.jpg?itok=rcOrp-IF"
        },
        { 
            name: "Henry",
            breed: "Munchkin Cat",
            age: "2",
            temperament: "Fuzzy and Playful",
            outdoor: false,
            adoptionFee: 350,
            imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Munchkin.jpg?itok=lSFfht9e"
        },
        {
            name: "Annie",
            breed: "Ragdoll",
            age: "7",
            temperament: "Cuddly and Playful",
            outdoor: false,
            adoptionFee: 600,
            imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Ragdoll_240x240%20%281%29.jpg?itok=NuWXBB9T"   
        },
        {
          name: "Kylo Ren",
          breed: "Balinese-Javanese",
          age: "2",
          temperament: "Affectionate and Talkative",
          outdoor: false,
          adoptionFee: 800,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Javanese_body_6.jpg?itok=HDaIyrJN"   
        },
        {
          name: "Marie",
          breed: "Chartreux",
          age: "3",
          temperament: "Loving and Playful",
          outdoor: true,
          adoptionFee: 400,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Chartruese_body_6.jpg?itok=-1f4kRHH"   
        },
        {
          name: "Dryer Lint",
          breed: "Cornish Rex",
          age: "1",
          temperament: "Active and Mischievous",
          outdoor: false,
          adoptionFee: 600,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/CornishRex_body_7.jpg?itok=E0NJBg64"   
        },
        {
          name: "Franklin",
          breed: "Himalayan",
          age: "2",
          temperament: "Sweet and Cuddly",
          outdoor: false,
          adoptionFee: 800,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Himilayan_body_6.jpg?itok=VNb53gh8"   
        },
        {
          name: "Tiny",
          breed: "Maine Coon",
          age: "4",
          temperament: "Gentle and Friendly",
          outdoor: false,
          adoptionFee: 900,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/MaineCoon_body_7.jpg?itok=1WyLfNDu"   
        },
        {
          name: "Aragorn",
          breed: "Norwegian Forest Cat",
          age: "2",
          temperament: "Gentle and Athletic",
          outdoor: true,
          adoptionFee: 600,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/NorwegianForestCat_body_6.jpg?itok=oyveyl95"   
        },
        {
          name: "Smeagol",
          breed: "Peterbald",
          age: "3",
          temperament: "Intelligent and Social",
          outdoor: false,
          adoptionFee: 700,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Peterbald_body_6.jpg?itok=uDwMZ7SK"   
        },
        {
          name: "Crumpet",
          breed: "Ragamuffin",
          age: "2",
          temperament: "Sweet and Loving",
          outdoor: false,
          adoptionFee: 500,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/RagaMuffin_body_7.jpg?itok=_Xi-6ntW"   
        },
        {
          name: "Blueberry",
          breed: "Russian Blue",
          age: "1",
          temperament: "Gentle and Quiet",
          outdoor: false,
          adoptionFee: 600,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/RussianBlue_body_7.jpg?itok=2R8ZUJwV"   
        },
        {
          name: "Angus",
          breed: "Scottish Fold",
          age: "3",
          temperament: "Intelligent and Playful",
          outdoor: false,
          adoptionFee: 700,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/SchottishFoldLH_body_7.jpg?itok=CFR7z3LM"   
        },
        {
          name: "Blotch",
          breed: "Savannah",
          age: "1",
          temperament: "Loyal and Adventurous",
          outdoor: true,
          adoptionFee: 800,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Savannah_body_7.jpg?itok=hmp0_c1v"   
        },
        {
          name: "Teddy",
          breed: "Selkirk Rex",
          age: "4",
          temperament: "Friendly and Social",
          outdoor: false,
          adoptionFee: 600,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/SelkirkRex_body_7.jpg?itok=NdVIkFaq"   
        },
        {
          name: "Jabba",
          breed: "Singapura",
          age: "5",
          temperament: "Playful and Extroverted",
          outdoor: true,
          adoptionFee: 400,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Singapura_body_7.jpg?itok=8I234gZj"   
        },
        {
          name: "Tony",
          breed: "Toyger",
          age: "3",
          temperament: "Intelligent and Outgoing",
          outdoor: true,
          adoptionFee: 500,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/Toyger_body_7.jpg?itok=XZd4UW7n"   
        },
        {
          name: "Ash",
          breed: "Turkish Angora",
          age: "2",
          temperament: "Active and Playful",
          outdoor: false,
          adoptionFee: 600,
          imageURL: "https://www.purina.com/sites/default/files/styles/kraken_generic_max_width_480/public/TurkishAngora_body_7.jpg?itok=wDtFZLqW"   
        }
      ]
      const cats = await Promise.all(catsToCreate.map(createCats))
  
      console.log("Cats created:")
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
        userId: 2,
        creditCardName: "Albert Bertie",
        creditCard: "123456789012345",
        creditCardExpirationDate: "01/25",
        creditCardCVC: "1234",
        status: "pending"
        
      },
      {
        userId: 1,
        creditCardName: "Sandra Bullock",
        creditCard: "39053290581903",
        creditCardExpirationDate: "10/23",
        creditCardCVC: "787",
        status: "pending"
      },
      {
        userId: 3,
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
