const router = require('express').Router()
const { checkErrors } = require('../../helpers/middlewares')
const { newProduct } = require('../../helpers/validators')
const Product = require('../../models/product.model')
const { checkSchema } = require('express-validator')
const multer = require('multer')
const upload = multer({ dest: 'public/images' })
const fs = require('fs')


router.get('/', async (req, res) => {

  const { page = 1, limit = 6 } = req.query

  /*
  * page = 1 skip= 0 limit=5
  * page = 2 skip= 5 limit=5
  * page = 3 skip 10 limit= 5
  * Por la tanto skip = (page -1) * limit
   */
  

  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner')
    const total = await Product.count()
    console.log(total)
    res.json({
      info: {
        current_page: parseInt(page),
        count: total,
        pages: Math.ceil(total/limit)
      },
      results: products
    })    
  } catch (err) {
    res.json({ fatal: err.message })    
  }
})

router.post('/', upload.single('image'), checkSchema(newProduct), checkErrors, async (req, res) => {
  try {
    // Agregamos la extensión a la imagen
    console.log(req.files)
    const extension = req.file.mimetype.split('/')[1]
    const newPath = `${req.file.path}.${extension}`
    fs.renameSync(req.file.path, newPath)
    req.body.owner = req.user._id
    req.body.image = `${req.file.filename}.${extension}`
    const newProduct = await Product.create(req.body)  
    res.json(newProduct)
  } catch (err) {
    res.json({ fatal: err.message })    
  }
})

router.put('/:productId', async (req, res) => {
  const { productId } = req.params
  
  try {
    const productUpdate = await Product.findByIdAndUpdate(productId, req.body, { new: true })
    
    console.log(productUpdate)
    res.json(productUpdate)
  } catch (err) {
    res.json({fatal: err.message})
  }
})

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params
  try {
    const result = await Product.findByIdAndDelete(productId)
    res.json(result)
    
  } catch (err) {
    res.json({fatal: err.message})
  }
})

router.get('/actives', async (req, res) => {
  try {
    const products = await Product.actives()
    // const products = await Product.find({
    //   $or: [
    //     { stock: 0 },          
    //     {available: false}
    //   ]
    // })

    res.json(products)
  } catch (err) {
    res.json({ fatal: err.message })    
  }
})

router.get('/:departamento', async (req, res) => {
  const { departamento } = req.params
  try {
    const products = await Product.find({ department: departamento })  
    res.json(products)

  } catch (err) {
    res.json({fatal: err.message})
  }
})

router.get('/min/:preciomin/max/:preciomax', async (req, res) => {
  const { preciomin, preciomax } = req.params
  try {
    const products = await Product.find({ price: { $gte: preciomin, $lte: preciomax } })
      if(products.length === 0) {
        res.json({mensaje: 'No hay productos en ese rango de precios'})
      } else {
        res.json(products)        
        }
    } catch (err) {
    res.json({ fatal: err.message })    
  }
})



module.exports = router