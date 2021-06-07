/**
@description Actualizar Cliente
@method: put
@url: http://localhost:4000/api/customer
*/

{
    "idCliente": 9,
    "nombre" : "prentomovifds--l",
    "razonSocial" : "prentomovil",
    "urlFoto" : "",
    "idTipoIdentificacion" : 6,
    "identificacion" : "031-0569717-4",
    "tipoComprobante" : 6,
    "idVendedor" : 4,
    "correo" : "freilinjb@gmail.com",
    "telefono" : "849-526-1234",
    "diasCredito" : 30,
    "limiteCredito" : 100,
    "aplicaDescuento" : 1,
    "descuento" : 0.10,
    "idProvincia" : 1,
    "idCiudad" : 1,
    "direccion" : "Villa Progreso, La Herradura",
    "observacion" : "PRUEBA",
    "creado_por" : 1,
    "estado" : 1
}

/**
@description Registrar un producto
@method: put
@url: http://localhost:4000/api/customer
*/

{
    "codigo": "ASDF A",
    "nombre": "ARENQUE ROJO",
    "idCategoria": 1,
    "idSubCategoria": 1,
    "idMarca": 1,
    "idUnidad": 1,
    "descripcion": "asdfasdf",
    "stockInicial": 44,
    "stockMinimo": 666,
    "reorden": 44,
    "observacion": "fasdf",
    "incluyeItbis": 1,
    "precioVenta": 4888,
    "precioCompra": 456,
    "idProveedor": [1,2,3],
    "creado_por": 1,
    "estado": 1
}

/**
 * @description Realizando busqueda de productos
 * @url http://localhost:4000/api/product?page=2&search=hola mundo
 * @method get
 */


/**
 * @description Registrar proveedor
 * @url http://localhost:4000/api/supplier
 * @method post
 */
 {
    "nombre": "SPIDERMAN",
    "razonSocial": "SPIDERMAN",
    "rnc" : "03106484684",
    "correo": "spiderman@spiderman.com",
    "telefono": "849-565-4444",
    "idProvincia": 1,
    "idCiudad": 1,
    "direccion": "Villa Progreso, La Herradura",
    "observacion": "Hola muindi",
    "creado_por": 1,
    "estado": 1
}

/**
 * @description Consultando ciudades
 * @url http://localhost:4000/api/city/1
 * @method post
 */

/**
 * @description Consultando provincia
 * @url  http://localhost:4000/api/province/4
 * @method post
 */

/**
 * @description Consultando Categoria
 * @url  http://localhost:4000/api/product/category/
 * @method post
 * nombre: ,
 * estado: 
 */

/**
 * @description Consultando Categoria
 * @url  http://localhost:4000/api/product/category/20
 * @method put
 */

/**
 * @description Consultando Categoria
 * @url  http://localhost:4000/api/product/category/20
 * @method delete
 * nombre: ,
 * estado: 
 */





