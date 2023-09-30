const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const checkErrors = (req, res, next) => {
  console.log(req)
  // Comprobar los errores del a validación

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const mensajes = errors.array().map(error => error.msg)
    return res.json(mensajes)
  } else {
    next()
  }
}

const checkToken = async (req, res, next) => {
  
  const token = req.headers['authorization']
  // ¿Esta el token en la cabecera de autenticación?
  if (!token) {
    return res.json({ fatal: 'Debes incluir el token' })    
  }
  let payload
  // ¿Es correcto el token?
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY)
  } catch (err) {
    return res.json({ fatal: err.message })    
  }

  // Lo que viene a continuación no es una comprobación del token 
  // Recupero el usuario a partir del token
  // En base al token desencriptado (con lo que puedo acceder al payload.user_id) recupero el user para engancharselo a la petición. Para tener disponible ese user durante todo el flujo
  const user = await User.findById(payload.user_id)
  req.user = user
  next()

  
}


module.exports = {
  checkErrors,
  checkToken
}