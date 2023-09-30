// Ejemplo
// const sumar = (a, b) => a + b



// describe('Api de products', () => {
//   describe('GET /api/products', () => {
//     it('Debería devolver la suma de dos números', () => {
//       expect(sumar(3, 4)).toBe(7)
//       expect(sumar(1, 7)).toBe(8)
//       expect(sumar(3,0)).toBe(3)
//     })
//   })
// })

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const Product = require('../../models/product.model')


describe('Api de products', () => {

  beforeAll(async () => {
    // Conectar a la base de datos
    await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online')  
  })
  
  afterAll(async () => {
    await mongoose.disconnect()     
   })
  
  
  describe('GET /api/products', () => {
    let response
    beforeAll( async () => {
      response = await request(app).get('/api/products').send()      
    })

    it('El status deberia ser 200', async () => {
      expect(response.statusCode).toBe(200)
    })

    it('Deberia devolver datos en formato JSON', async () => {
      expect(response.headers['content-type']).toContain('json')      
    })

    it('Debería devolver un array', () => {
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('POST /api/products', () => {
    // La base de datos después de las pruebas debe quedar como nos la encontramos
    let response
    const body = { name: 'Producto prueba', description: 'Es para probar', price: 128, available: true, stock: 300, department: 'test', image: '' }
    beforeAll(async () => {
      response = await request(app).post('/api/products').send(body)
    })

    afterAll(async () => {
      // Dejamos la BD como estaba antes de estas pruebas
      await Product.deleteMany({ department: 'test' })      
    })

    it('Debería responder con status 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('Deberia devolver la respuesta en formato json', () => {
      expect(response.headers['content-type']).toContain('json')  
    })

    it('Debería insertar correctamente el producto', () => {
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe(body.name)
    })
  })

  describe('PUT /api/products/PRODUCTID', () => {
    let response
    let newProduct
    const body = { name: 'Producto prueba', description: 'Es para probar', price: 128, available: true, stock: 300, department: 'test', image: '' }
    // Crear un objeto de prueba dentro de la BD
    // Ejecutamos la petición
    beforeAll(async () => {
      newProduct = await Product.create(body)
      response = await request(app).put(`/api/products/${newProduct._id}`).send({ price: 200, stock: 120 }) // Se pueden meter solo los datos que se quiera modificar      
    })

    afterAll(async () => {
      await Product.findByIdAndDelete(newProduct._id)
    })

    it('Debería responder correctamente', () => {
      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('json')
    })

    it('Debería realizarse la modificación en el documento', () => {
      expect(response.body.price).toBe(200)
      expect(response.body.stock).toBe(120)
    })


  })

  describe('DELETE /api/products/PRODUCTID', () => {

    const body = { name: 'Producto prueba', description: 'Es para probar', price: 128, available: true, stock: 300, department: 'test', image: '' }

    let newProduct, response
    beforeAll(async () => {
      newProduct = await Product.create(body)
      response = await request(app).delete(`/api/products/${newProduct._id}`).send()
    })
    afterAll(async () => {
      await Product.findByIdAndDelete(newProduct._id)
    })

    it('Debería responder correctamente', () => {
      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('json')
    })

    it('Debería borrarse de la base de datos', async () => {
      const productFound = await Product.findById(newProduct._id)
      expect(productFound).toBeNull()
    })

    it('Deberia responder con el objeto borrado', () => {
      expect(response.body._id.toString()).toBe(newProduct._id.toString())
      expect(response.body.name).toBe(newProduct.name)
    })
  })


})
