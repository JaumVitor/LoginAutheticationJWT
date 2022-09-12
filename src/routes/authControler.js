const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const User = require('../models/User.Model')
const { secret } = require('../config/auth.json')

// Usando nodemailer para mandar mensagem no email, quando usuario se registrar
const userNodeMailer = require('../modules/mailer')

// Criando function para gerar meu hash 
function generateToken ( params = {} ){
  // Passando o identificador unico do user, secret e tempo de expiração do token
  const token = jwt.sign( params, secret, {
    expiresIn: 86400
  });
  return token
}

router.get ('/', async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})

router.get ('/register', async (req, res) => {
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
              return res.status(400).send( {error: 'Error when trying to create user'} )
            })
        }else {
          return res.status(400).send({ error: 'User already exist' })
        }
      }).catch( err => {
        console.log('err', err.message)
      })
  }catch (err) {
    return res.status(400).send( {error: 'Error when trying to create user'} )
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
          // "Erro ao usar o res.status"
          return res.status(201).send({
            user, 
            token: generateToken( {id: user._id} )
          })
        }
        // email encotrado e senha incorreta
        return res.status(400).send( {error: 'Password incorrect'} )
      }
      return res.status(400).send( {error: 'User not found'} )
    }).catch ( err => {
      console.log(err.message)
    })
})

router.get ('/forget_password', (req, res) => {
  res.status(200).send('Router forget password')
})

router.post ('/forget_password', async (req, res) => {
  const { email } = req.body

  await User.findOne( { email: email } )
    .then ( async user => {
      if (!user) {
        return res.status(400).send( {err: "User not exist"} )
      }
      // Criando token e enviando ao email do cliente
      const token = crypto.randomBytes(20).toString('hex') 
      let now = new Date()
      now.setHours(now.getHours() + 1)

      // Setando token e tempo de expiração no user
      await User.findByIdAndUpdate( user.id, {
        passwordForget: token, 
        passwordForgetExpires: now
      }, { new: true })

      userNodeMailer(token, email, 'forgotPassword.ejs')        
      return res.status(200).send("Token generate successful, check your email ")

    }).catch (err => {
      return res.status(400).send( {err: err.message} )
    })
})

router.post ('/reset_password', async (req, res) => {
  const { token, email, newPassword } = req.body

  await User.findOne( {email: email} )
    .then ( async user => { 
      if (!user) {
        return res.status(400).send('User not found')
      }
      if (token != user.passwordForget) {
        return res.status(400).send('Token invalid')
      }
      const now = new Date()
      if (now > user.passwordForgetExpires){
        return res.status(400).send('Token expires')
      }
      // Token e usuario validado 
      user.password = newPassword
      //Para fazer a encriptação do usuario
      await user.save() 

      return res.status(200).send(user)
    }).catch ( err => {
      return res.status(400).send( {err: err.message} )
    })
})

module.exports = router

