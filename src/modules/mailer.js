const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')

const { host, port, user, pass } = require('../config/mail.json')
const User = require('../models/User.Model')

// Configurando nodemailer
const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
})

// Função emite mensagem que vai ser encaminhada para o cliente
const userNodeMailer = async (token, email, file) => {
  const user = await User.findOne( {email} )
  const data = await ejs.renderFile(path.join(__dirname, `../views/${file}`), { token, name: user.name })

  const mainOptions = {
    from: 'jaum_https@gmail.com',
    to: email,
    subject: 'Forgot my password!',
    html: data,
  }

  transport.sendMail(mainOptions, (err, info) => {
    if (err) {
      console.log(err)
    }
    console.log('Message sent: ' + info.response)
    res.status(200).send("menssage sended")
  })
}

module.exports = userNodeMailer
