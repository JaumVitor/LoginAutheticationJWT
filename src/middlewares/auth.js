const jwt = require('jsonwebtoken')
const { secret } = require('../config/auth.json')

// Criando middleware que vai decodificar os dados enviados do token 
// Ao final encaminhando os dados para a requisição das rotas que usarem o middleware
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  // Verificando se recebi o token
  if (!authHeader) {
    return res.status(401).send( {error: "No token provided"} )
  }
  // Validando partição do token 
  const parts = authHeader.split(' ');
  if (!(parts.length == 2)) {
    return res.status(400).send( {error: 'Token error'} )
  }
  
  [ scheme, token ] = parts

  // Validando o type-token 
  if (!/^Bearer$/i.test(scheme)){
    return res.status(401).send( {error: 'Token malformatted'} )
  }

  // Decodificando meu token para capturar id
  jwt.verify( token, secret, (err, decoded) => {
    if (err) res.status(400).send( err.message )

    // Os atributos que eu decodificar podem ser enviados para a requisição das minhas rotas 
    req.userId = decoded.id
  })
  next()
} 