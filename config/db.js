// Para evitar un fallo en el servidor, creo que con la versión de mongoos que tengo no haría falta con la v7 se soluciona (de mongoose)
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)