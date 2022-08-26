const mongoose = require('mongoose');

const connectDataBase = async () => { 
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@loginauthentication.pox4fyg.mongodb.net/?retryWrites=true&w=majority`, (err) => {
      if (err) {
        return console.log('Erro', err.message);
      }
      return console.log('Banco de dados conectado')
    })
}

module.exports = connectDataBase