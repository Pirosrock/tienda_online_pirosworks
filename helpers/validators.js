const newProduct = {
    name: {
      exists: {errorMessage: 'El campo nombre es obligatorio'},
    isEmpty: {
      errorMessage: 'El campo nombre debe incluir un valor',
      options: { ignore_whitespace: true },
      negated: true
    }
    },
    description: {
      isLength: {
        options: { min: 10, max: 100 },
        errorMessage: 'La descripción debe estar entre 10 y 100 caracteres'
      }
    },
    department: {
      isIn: {
        options: [['moda', 'papeleria', 'informatica']],        
        errorMessage: 'Departamento erroneo'
      }  
    },
    price: {
      isFloat: {
        options: { min: 0, max: 5000 },
        errorMessage: 'Revisa el rango para el precio'
      }  
    }
}
  

module.exports = { newProduct }
