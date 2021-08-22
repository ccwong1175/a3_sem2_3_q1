const mongoose = require('mongoose')
const restaurantList = require('../../restaurant.json')
const Restaurant = require('../restaurant')
mongoose.connect('mongodb://localhost/a3-sem2-3-q1', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  const results = restaurantList.results
  for(let i= 0; i<8; i++){
    Restaurant.create({ 
      restaurant_id: results[i].id,
      name: results[i].name,
      name_en: results[i].name_en,
      category: results[i].category,
      image: results[i].image,
      location: results[i].location,
      phone: results[i].phone,
      rating: results[i].rating,
      description: results[i].description
    })
  }
  console.log('done')
})