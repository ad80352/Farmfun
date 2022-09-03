if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
 

const mongoose = require('mongoose');
const farms = require('./farms')
const Farm = require('../models/farm')
const users = require('../models/user')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/FarmFun';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const seedDB = async () => {
    await Farm.deleteMany({});    

    for (let i = 0 ; i < 84 ; i++) {
        // const random84 = Math.floor(Math.random() * 84); 可以想一下要怎麼隨機取出不重複的50個值

        const farm = new Farm({    
            author: '63133336e55b6a90816665a8',  
            title: `${farms[i].Name}`,
            address: `${farms[i].Address}`,
            location: `${farms[i].City}, ${farms[i].Town}`,
            geometry: {
                type: 'Point',
                coordinates: [`${farms[i].Longitude}`, `${farms[i].Latitude}`]
              },
            description: `${farms[i].HostWords}`,
            image: `${farms[i].Photo}`,
            website: `${farms[i].Url}`,
            tel: `${farms[i].Tel}`,
            openHours: `${farms[i].OpenHours}`,
            creditCard: farms[i].CreditCard,
            travelCard: farms[i].TravelCard
        })

        await farm.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})

