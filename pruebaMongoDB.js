const mongoose = require('mongoose')
const Product = require('./models/product.model')

const User = require('./models/user.model')

  
  
  (async () => {
  
  // mongoose.set('strictQuery', false)
  await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online')
  // const response = await Product.create({
  //   name: 'Pantalones marrones',
  //   description: 'Son para las piernas',
  //   price: 54,
  //   department: 'moda',
  //   available: true,
  //   stock: 28,
  //   image: 'https://images.boardriders.com/globalGrey/billabong-products/all/default/large/s1pn02bip0_billabong,f_2845_frt1.jpg'
  // })
  
    const product1 = await Product.find()
  console.log(product1)
  // const products = await Product.find({
  //   price: { $gt: 20 }, // $gt, $gte, $lt, $lte
  //   available: true
  // })
  // const user = await User.create({
  //   username: 'Piros',
  //   email: 'piros@gmail.com',
  //   address: 'Calle seca 23',
  //   edad: 34,
  //   role: 'admin'
  // })
  // console.log(response)
  console.log(products)

  await mongoose.disconnect()  
})()

