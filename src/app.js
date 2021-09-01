const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');
const request = require('request');

const app = express();

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views(currently templates directory) location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Yash"
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: "Yash"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        msg: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        name: "Yash"
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "You must provide an address"
        })
    }
       
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error: error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error: error
                })
            }

            res.send({
                address: req.query.address,
                forecast: forecastData,
                location
            })
        })
    })

    // res.send({
    //     address: req.query.address,
    //     forecast: "50 degress",
    //     location: "Philadelphia"
    // });
})

app.get('/products', (req, res) => {
    if(!req.query.search){
       return  res.send({
            error: "404 error not found"
        })
    }
    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: "Yash",
        msg: "Help article not found"
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: "Yash",
        msg: "Page Not found"
    })
})

app.listen(3000, () => {
    console.log('The server has started at port 3000!');
})