const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost/a3-sem2-3-q1', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error',() =>{
  console.log('mongodb error!')
})

db.once('open',() =>{
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
   Restaurant.find()
  .lean()
  .then(restaurant =>res.render('index', {restaurant}))
  .catch(error =>console.log(error))
})

app.get('/restaurant/new', (req,res) =>{
  return res.render('new')
})

app.post('/restaurant', (req, res) =>{
  const name = req.body.name
  const category = req.body.category
  const location = req.body.location
  const phone = req.body.phone
  const description = req.body.description
  const rating = req.body.rating
  const image = req.body.image
  return Restaurant.create({name, category, location, phone, description, rating, image})
    .then(() =>res.redirect('/'))
    .catch(error =>console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant =>res.render('show', {restaurant}))
    .catch(error =>console.log(error))
})

app.get('/restaurant/:id/edit', (req, res) =>{
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurant/:id/edit', (req, res) =>{
  const id = req.params.id
  const name = req.body.name
  const category = req.body.category
  const location = req.body.location
  const phone = req.body.phone
  const description = req.body.description
  const rating = req.body.rating
  const image = req.body.image
  return Restaurant.findById(id)
    .then(restaurant =>{
      restaurant.name = name
      restaurant.category = category
      restaurant.location = location
      restaurant.phone = phone
      restaurant.description = description
      restaurant.rating = rating
      restaurant.image = image
      return restaurant.save()
    })
    .then(() =>res.redirect(`/restaurants/${id}`))
    .catch(error =>console.log(error))
})

app.post('/restaurant/:id/delete', (req, res) =>{
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  const restaurants = Restaurant.filter(restaurant => {

    return restaurant.name.includes(keyword)
  })
  console.log(keyword)
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(3000, () =>{
  console.log('App is running on http://localhost:3000')
})