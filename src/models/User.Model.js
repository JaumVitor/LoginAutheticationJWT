const { mongoose } = require('../database/connect')

const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },

  email: {
    type: String, 
    require: true,
    unique: true, 
    lowcase: true,
  }, 
  
  password: {
    type: String, 
    require: true,
    select: false //Não trazer-lo quando requisitado
  },

  passwordForget: {
    type: String,
    require: true
  },

  passwordForgetExpires: {
    type: String, 
    require: true
  },

  createAt: {
    type: Date,
    default: Date.now()
  }
})

// Antes de salvar o user, o password é encripitado
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  // now we set user password to hashed password
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User 
