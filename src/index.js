const express = require('express')
const app = express()
const bodyParser = require('body-parser')

require('dotenv').config()

// chamando a função que foi exportada
const { connectDataBase } = require('./database/connect')
connectDataBase()

// Congigurando rotas
const authControler = require('./routes/authControler')
const authAccess = require('./routes/authAccess')

// Configurando o body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).send('Main page')
})

app.use('/auth', authControler)
app.use('/access', authAccess)

const port = process.env.PORT
app.listen(port, () => console.log(`Listener in port ${port}`))
