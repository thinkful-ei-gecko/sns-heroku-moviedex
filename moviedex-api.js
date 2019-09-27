require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MovieList = require('./moviedatastore');

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use ((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }};
    } else {
        response = { error };
    }
    res.status(500).json(response);
})

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unathorized request' })
    }
    next()
})

app.get('/', (req, res) => {
    res.send('Hello there');
})

app.get('/movie', (req, res) => {
    const { genre, country, avg_vote } = req.query;
    const vote  = parseInt(avg_vote)

    let results = [...MovieList];

    if (avg_vote < 1 || avg_vote > 10) {
        res
            .status(400)
            .json({ error : 'average vote must be between 1 and 10'})
    }

    if (genre) {
        results = results.filter(movie => {
            return movie["genre"].toLowerCase().includes(genre.toLowerCase())
        })
    }

    if (country) {
        results = results.filter(movie => {
            return movie["country"].toLowerCase().includes(country.toLowerCase())
        })
    }

    if (avg_vote) {
        results = results.filter(movie => {
            return movie["avg_vote"] >= vote;
        })
    } 

    res.json(results)
})

module.exports = app;