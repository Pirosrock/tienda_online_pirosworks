const router = require('express').Router()
const User = require('../../models/user.model')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const {createToken} = require('../../helpers/utils')
const { checkToken, checkErrors } = require('../../helpers/middlewares')


router.get('/', checkToken, async (req, res) => {
  try {
    const users = await User.find().populate('products');
    res.json(users);
  } catch (error) {
      res.json({ fatal: error.message });
    }
});

router.get('/cart', checkToken, async (req, res) => {
  try {
    const user = await req.user.populate('products')
    res.json(user.products)
  } catch (err) {
    res.json({fatal: err.message})
  }
})

router.get('/cart/add/:productId', checkToken, async (req, res) => {
  const { productId } = req.params
  // req.user  
  try {
    req.user.products.push(productId)
    await req.user.save()
    res.json({success: 'Producto agregado'})
    
  } catch (err) {
    res.json({ fatal: err.message })    
  }  

})

router.get('/profile', checkToken, async (req, res) => {
  // Aqui si que tengo disponible el req.user porque antes de pasar por aqui:
  // 1- Me he logueado --> por lo tanto me ha dado un token con el id de ese usuario
  // 2- He pasador por el chekToken --> he recuperado el user con ese id del token
  try {
    const user = await User
      .findById(req.user._id)
      .populate('products')
    res.json(user)
  } catch (err) {
    res.json({fatal: err.message})
  }
})

router.get('/cart/remove/:productId', checkToken, async (req, res) => {
  const { productId } = req.params
  req.user.products.pull(productId)
  await req.user.save()
  res.json({success: 'Producto eliminado del carrito'})
})

router.post('/register',
  body('username')
    .exists().withMessage('El username es requerido')
    .isLength({min: 3, max:12}).withMessage('El campo username tiene que tener más de tres caracteres'),
  body('email')
    .isEmail().withMessage('El email debe tener un formato correcto'),
  body('password')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/).withMessage('El password es incorrecta'),
  body('role')
    .isIn(['regular', 'admin', 'moderator']).withMessage('El rol no está admitido'),
  body('age')
    .custom((value) => {
      return value >= 18 && value <= 65
    }).withMessage('La edad debe de estar entre 18 y 65 años'),
  checkErrors,
  async (req, res) => {
    // Comprobamos errores
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 11)
    const newUser = await User.create(req.body)
    res.json(newUser)
  } catch (err) {
    res.json({fatal: err.message})
  }
})


router.post('/login', async (req, res) => {
  try {
    // login --> email, password
    const { email, password } = req.body
    // ¿Existe el usuario?
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.json({ fatal: 'Error en email y/o contraseña' })
    }
  
    // ¿Coincide la password?
  
    const iguales = bcrypt.compareSync(password, user.password)
    if (!iguales) {
      return res.json({ fatal: 'Error en email y/o contraseña' })
    }
    res.json({
      success: 'Login correcto',
      token: createToken(user)
    })
  } catch (err) {
    res.json({fatal: err.message})
  }
 
})

router.put('/:userId', checkToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.json(user);
  } catch (error) {
      res.json({ fatal: error.message });
    }
})


// router.delete('/:userId', (req, res) => {

// })


module.exports = router