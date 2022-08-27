const express = require('express')

const router = express.Router()

const User = require('../models/User.Model')

router.get ('/', (req, res) => {
  res.status(201).send('OK')
})

router.post ('/register', async (req, res) => {
  const { email } = req.body
  try {
    // Buscando email com o email passado pela request
    User.findOne({ email: email }) 
      .then( async data => {
        if (!data) {
          // Validação de existencia do usuario
          const user = await User.create(req.body)
          // Omitindo a senha na resposta
          user.password = undefined
          res.status(200).send(user)
        }else {
          res.status(400).send({ error: 'User already exist' })
        }
      }).catch( err => {
        console.log('err', err.message)
      })
  }catch (err) {
    res.status(400).send('Error when trying to create user')
  }
})

module.exports = router

