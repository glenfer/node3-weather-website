const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req ,res) =>{
    res.render('index', {
        title:'Weather',
        name:'Glen Fernandes'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title:'About Me',
        name:'Glen Fernandes'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        message: 'This is a helpful message!', 
        title: 'Help',
        name: 'Glen Fernandes'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error:error})
        }

        forecast(latitude, longitude, (error, forecastData) =>{
            if (error) {
                return res.send({error:error})
            }
            
            res.send({
                forecast: forecastData,
                location:location,
                address: req.query.address
            })
        })
    })

 })

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term!"
        })
    } 

    console.log(req.query.search)
    res.send({
        products:[]
    })
    
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        message: 'Help article not found',
        title: 'ERROR',
        name: 'Glen Fernandes'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        message: 'Page not found',
        title: 'ERROR',
        name: 'Glen Fernandes'
    })
})

app.listen(3000, () =>{
    console.log('Server is up on port 3000.')
})