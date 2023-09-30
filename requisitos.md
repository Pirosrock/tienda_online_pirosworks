# Api de productos

## GET /api/products

- Recupera todos los productos de la BD
- PRUEBAS:
  - Status que nos devuelve es 200
  - La respuesta debe tener formato JSON
  - La respuesta debe ser un array de productos
  - Los elementos dentro del array tienen que ser productos

## POST /api/products

- Creación de un producto en la base de datos
- A través del body le hago llegar todos los datos del nuevo producto
- Como respuesta recibiremos todos los datos del nuevo producto
- PRUEBAS:
  - Que la respuesta sea correcta -> status 200
  - Que el valor de la respuesta sea un json
  - Comprobar si se ha insertado el producto

## PUT /api/products/PRODUCTID

- Actualiza los datos de un producto en la BD 
- El id del producto a actualizar lo recibe en la URL
- Los datos del producto para su actualización se reciben en req.body
- La respuesta debe ser el producto modicado
- PRUEBAS:
  - Que la respuesta sea correcta -> status: 200.   Content-type: application/json 
  - Debemos comprobar si los datos devueltos en la respuesta coinciden con la modificación realizada

## DELETE /api/products/PRODUCTID

- Borra un producto de la BD
- El id del producto a borrar lo recibimos a través de la URL
- La respuesta debe incluir los datos del producto borrado
- PRUEBAS:
  - Que la respuesta sea correcta -> status: 200.   Content-type: application/json 
  - Comprobar si los datos de la respuesta se corresponden con el producto borrado
  - Comprobar si el producto sigue en la base de datos 

## GET /api/products/DEPARTAMENTOS
  - Recupera todos los productos del departamento que adjuntemos en la URL
  - find(FILTRO)

## GET /api/products/min/PRECIOMIN/max/PRECIOMAX
- Recupera los productos en un rago de precios
- Los precios están en la URL

## GET /api/products/
- Recupera los productos que esten disponibles y con stock mayor que cero
- find(FILTRO)

# USUARIOS

- Modelo: user --> username, email, password, active (boolean), role
- RUTA:
/api/users/register
- Recibe a través del body los datos con todo el user (un user entero) y lo guardad en la BBDD

# RUTA PARA AÑADIR PRODUCTOS A USUARIOS

GET /api/users/cart/add/:PRODUCTID
  - Agrega al usuario (el usuario que ha hecho login) un producto en concreto

# RUTA PARA RECUPERAR LOS PRODUCTOS DEL USUARIO LOGADO

GET api/users/cart
- Recupera un array con todos los productos del usuario autenticado

# RUTA PARA RECUPERAR EL PERFIL DEL USUARIO LOGADO
- Y sus productos asociados
/api/user/profile

## GET /api/user/cart/remove/PRODUCTID
- Pasamos el id del producto a traves de la url y borramos dicho producto del carrito autenticado


## App Angular

- Crear la aplicacion -> TiendaOnline (instalar bootstrap)
- Rutas:
  - /login -> components/loginComponent
  - /productos -> components/productos/ListaProductos

- Servicios: 
  - UserService
  - ProductsService
- NO OLVIDAR: IMPORTAR reactiveFormModule y httpClientModule
- Dentro de LoginComponent generamos un formulario con email y password
- Los datos de este formulario los mandamos a POST localhost:300/api/users (método dentro del servicio)
  - En la respuesta estará el token -> almacenar el localStorage
- Dentro de listaProductos recuperamos todos los productos localhost:3000/api/products (método dentro del servicio)
- ¡¡Necesitamos el token!!

### Componente:FormProducts -ruta: prodcuts/new
- Dentro del componente generamos un formulario con todos los campos necesarios para la creacion de un producto
- En el servicio creamos un método que replique la petición para insertar productos del back
- ¡Cómo recoger y mostrar los errores!




