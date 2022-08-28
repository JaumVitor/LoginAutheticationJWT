const express = require('express')
const router = express.Router()

// Importando middleware de autorização
const authMiddleware = require('../middlewares/auth')

// Chamando middleware de autorização 
router.use (authMiddleware)

router.get ('/', (req, res) => {
  res.status(200).send( {
    OK: true,
    user: req.userId // Usando req.userId que foi decodificado no middleware
  })
})

module.exports = router