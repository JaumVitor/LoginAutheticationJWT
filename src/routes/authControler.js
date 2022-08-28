const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User.Model')
const { secret } = require('../config/auth.json')

// Criando function para gerar meu hash 
function generateToken ( params = {} ){
  // Passando o identificador unico do user, secret e tempo de expiração do token
  const token = jwt.sign( params, secret, {
    expiresIn: 86400
  });
  return token
}

router.get ('/', (req, res) => {
  res.status(200).send('OK')
})

router.get ('/register', (req, res) => {
  res.status(200).send('Router register')
})

router.post ('/register', async (req, res) => {
  const { email } = req.body
  try {
    // Buscando email com o email passado pela request, e emitindo token jwt
    User.findOne({ email: email }) 
      .then( async userFound => {
        if (!userFound) {
          // Validação de existencia do usuario
          await User.create(req.body)
            .then( user => {
              // Omitindo a senha na resposta
              user.password = undefined
              res.status(201).send({
                user,
                token: generateToken( {id: user._id} )
              })
            }).catch ( err => {
              res.status(400).send( {error: 'Error when trying to create user'} )
            })
        }else {
          res.status(400).send({ error: 'User already exist' })
        }
      }).catch( err => {
        console.log('err', err.message)
      })
  }catch (err) {
    res.status(400).send( {error: 'Error when trying to create user'} )
  }
})

router.get ('/authentication', (req, res) => {
  res.status(200).send('Router authentication')
})

router.post ('/authentication', async (req, res) => {
  // Rota de autenticação do ususario
  const { email, password } = req.body
  await User.findOne( { email } ).select( '+password' )
    .then( async user => {
      // Caso encontre o email, vericar se o password é compativel e emitir o token
      if (user) {
        // email compativel e senha correta 
        if (await bcrypt.compare( password, user.password)){
          user.password = undefined
          res.status(201).send({
            user, 
            token: generateToken( {id: user._id} )
          })
        }
        // email encotrado e senha incorreta
        res.status(400).send( {error: 'Password incorrect'} )
      }
      res.status(400).send( {error: 'User not found'} )
    }).catch ( err => {
      console.log(err.message)
    })
})

module.exports = router

