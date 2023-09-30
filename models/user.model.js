const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El campo username es obligatorio'],
    minLength: [3, 'El campo tiene que tener 3 o más caracteres'],
    maxLength: [10, 'Username no puede tener más de 10 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El campo email es requerido'],
    unique: true,
    match: [/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'El campo email no tiene el formato correcto']
  },
  password: String,
  address: String,
  age: {
    type: Number,
    min: 0,
    max: 100
  },
  role: {
    type: String,
    enum: ['regular', 'admin', 'moderator']
  },
  active: Boolean,
  products: [{type: Schema.Types.ObjectId, ref: 'product'}]
  
})




module.exports = model('user', userSchema)