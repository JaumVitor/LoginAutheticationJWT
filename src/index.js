const express = require('express')

const app = express()

const bodyParser = require('body-parser')

require('dotenv').config()

// chamando a função que foi exportada 
const connectDataBase = require('./database/connect')
connectDataBase()

// Configurando o body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use( (req, res) => {
  res.send('hello')
})

const port = process.env.PORT 
app.listen(port, () => console.log(`Listener in port ${port}`))