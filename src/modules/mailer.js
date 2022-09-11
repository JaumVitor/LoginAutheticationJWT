const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path') 

const { host, port, user, pass } = require('../config/mail.json')

// Configurando nodemailer
const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

// Função emite mensagem que vai ser encaminhada para o cliente 
const userNodeMailer = async () => {
  const data = await ejs.renderFile(path.join(__dirname, '../views/test.ejs'), {
    name: 'Stranger'
  })

  const mainOptions = {
    from: 'Tester" testmail@zoho.com',
    to: 'totest@zoho.com',
    subject: 'Hello, world!',
    html: data
  }

  await transport.sendMail(mainOptions, (err, info) => {
    if (err) {
      console.log(err)
    }
    console.log('Message sent: ' + info.response)
  })
}

module.exports = userNodeMailer