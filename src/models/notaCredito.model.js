const { connection } = require('../config/database');

exports.getSupplier = async (data, callback) => {
    try {
        let condicion = null;
        let search = '';

        condicion = data.idProveedor ? `WHERE p.idProveedor = ${data.idProveedor}`   : "";
        // condicion = (idProveedor) ? ` WHERE p.idProveedor = ${idProveedor}` : '';
        if(data.idProveedor == null && data.limit && data.offset >= 0) {
            if(data.search) {
                data.search = data.search.trim();
                search = ` WHERE CONCAT(p.nombre, p.razonSocial, p.correo,p.telefono, p.ciudad) LIKE '%${data.search}%'`;
            }
            condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
        }

        let total_page = 0;
        let total_rows = 0;

        console.log('busqueda: ', search);
        console.log('condicion: ', condicion);
        connection.query(
            `SELECT COUNT(p.idProveedor) AS cantidad FROM proveedor_v p ${search}`,
            [],
            async (error, results, fields) => {

                if(results.length > 0) {
                    console.log('prueba: ', results);
                    total_rows = results[0].cantidad;
                } else {
                    total_rows = 0;
                    console.log('prueba: ', results);
                }

                console.log('cantidad total: ', total_rows);
                connection.query(`
                    SELECT P.idProveedor,
                        COALESCE(p.nombre, p.razonSocial) AS nombre,
                        p.urlFoto,
                        p.RNC,
                        p.correo,
                        p.telefono,
                        p.ciudad,
                        p.creado_por,
                        P.creado_en,
                        CASE WHEN p.estado = TRUE THEN 1 ELSE 0 END AS estado 
                    FROM proveedor_v p ${search}  ${condicion}
                `,
                [], 
                (error, results, fields) => {
                    console.log('idProveedor: ', Math.ceil(total_rows/data.limit));
                    total_page = data.idProveedor == null ? Math.ceil(total_rows / data.limit) : 1;
                    console.log('total_page2: ', data.idProveedor);

                    return error ? callback(error) : callback(null, results, total_page, total_rows);
                });

                return total_page;
            }
        )
        console.log("cantidad: ", total_page);
    } catch (error) {
        console.error('error: ', error);
        return "Ah ocurrido un error";
    }
}

exports.getSupplierByID = async (idProveedor, callback) => {
    try {
        connection.query(`SELECT P.idProveedor,
        p.nombre, 
        p.razonSocial,
        p.RNC,
        p.correo,
        p.telefono,
        p.idCiudad,
        p.ciudad,
        p.idProvincia,
        p.provincia,
        p.direccion,
        p.observacion,
        p.creado_por,
        P.creado_en,
        CASE WHEN p.estado = TRUE THEN 1 ELSE 0 END AS estado
      FROM proveedor_v p  WHERE p.idProveedor = ?`,
      [idProveedor,],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      })
    } catch (error) {
        console.error("error: ", error);
        return "Ah ocurrido un error";
    }
}

exports.addSupplier = async (data, callback) => {
    try {
        console.log('data: ', data);
        connection.query(`CALL registrarProveedor (NULL,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            data.img ? data.img : '',
            data.nombre,
            data.razonSocial,
            data.rnc,
            data.correo,
            data.telefono,
            Number(data.idProvincia),
            Number(data.idCiudad),
            data.direccion,
            data.observacion,
            Number(data.creado_por),
            Number(data.estado)],
        (error, result, fields) => {
            return error ? callback(error) : callback(null, result[0]);
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

exports.updateSupplier = async (data, callback) => {
    try {
        console.log('data: ', data);
        connection.query(`CALL registrarProveedor (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            data.idProveedor,
            data.img ? data.img : '',
            data.nombre,
            data.razonSocial,
            data.rnc,
            data.correo,
            data.telefono,
            Number(data.idProvincia),
            Number(data.idCiudad),
            data.direccion,
            data.observacion,
            Number(data.creado_por),
            Number(data.estado)],
        (error, result, fields) => {
            return error ? callback(error) : callback(null, result[0]);
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

exports.getnotaCreditoPorProveedor = async (idProveedor, callback) => {
    connection.query(
        `SELECT 
        c.idCompra, 
        c.documento, 
        c.fecha,
        a.descripcion AS almacen,
        COALESCE(pv.nombre, pv.razonSocial) AS proveedor, 
        pv.RNC, 
        pv.telefono, 
        pv.correo, 
        SUM(dc.precio * dc.cantidad) AS total,
        COALESCE((
            SELECT SUM(pc.monto) FROM pago_compra pc WHERE pc.idCompra = c.idCompra
          ),0) AS pagado,

        CASE WHEN c.garantia IS TRUE THEN 1 ELSE 0 END AS garantia, 
        e.descripcion AS estado 
        FROM compra c
        INNER JOIN detalle_compra dc ON c.idCompra = dc.idCompra 
        INNER JOIN proveedor_v pv ON pv.idProveedor = c.idProveedor
        INNER JOIN almacen a ON c.idAlmacen = a.idAlmacen
        INNER JOIN estado e ON e.idEstado = c.idEstadoCompra
        WHERE pv.idProveedor = ${idProveedor}
        GROUP BY 1,2,3,4,5,6,7
        ORDER BY 3`
    ,[],
    (error, results, fields) => {
        if(error) {
            console.log('Error: ', error);
            return callback(error);
        } 
        return callback(null, results);
    });
}

exports.getNotaCredito = async (data, callback) => {
    try {
        connection.query(`
        SELECT 
            n.notaCredito, 
            n.NCF, 
            n.fecha, 
            COALESCE(cv.nombre, cv.razonSocial) cliente,
            cv.telefono, 
            cv.correo,
            f.numFactura,
            COUNT(dn.idProducto) cantidadArticulos,
            SUM(dn.cantidad * dn.precio) AS total
        FROM notacredito n
        INNER JOIN factura f ON n.numFactura = f.numFactura
        INNER JOIN cliente_v cv ON f.idCliente = cv.idCliente
        INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
        INNER JOIN detalle_notacredito dn ON dn.idProducto = df.idProducto
        WHERE f.activo IS TRUE
        GROUP BY 1,2,3,4,5,6,7;`,
                [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      })
    } catch (error) {
        console.error("error: ", error);
        return "Ah ocurrido un error";
    }
}

exports.getFacturas = async (numFactura,callback) => {
    const condicion = numFactura ? ` AND f.numFactura = ${numFactura}` : ''; 
    try {
        connection.query(`
        SELECT f.numFactura AS factura FROM factura f
        WHERE f.fecha >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND f.activo IS TRUE ${condicion}`,
                [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      })
    } catch (error) {
        console.error("error: ", error);
        return "Ah ocurrido un error";
    }
}

exports.registrarNotaCredito = async = (datos, callback) => {
    
    console.log('Datos: ', datos);
    // return;
    connection.query(`INSERT INTO notacredito(idUsuario, NCF, fecha, numFactura, observacion)
    VALUES(?,getNFC(4),CURRENT_DATE(), ?, ?)`,
    [
        datos.idUsuario,
        datos.numFactura,
        datos.observacion,
    ],
    (error, results, fields) => {
        if(error) {
            console.log('Error: ', error);
            return callback(error);
        }
  
        const notaCredito = results.insertId;

        if(datos.productos.length > 0) {
           datos.productos.forEach((key, index) => {

                connection.query(`INSERT INTO detalle_notacredito(notaCredito, idProducto, cantidad, precio)
                                VALUES(?,?,?,?)`,
                [notaCredito, key.idProducto, key.cantidad, key.precio],
                    (err, rs, f) => {
                    if(err) {
                        console.log('Error: ', err);
                        return callback(err);
                    }
                });

                connection.query(`UPDATE producto p SET p.stockInicial = p.stockInicial+${key.cantidad} WHERE p.idProducto = ${key.idProducto}`,
                [],
                    (err, rs, f) => {
                    if(err) {
                        console.log('Error: ', err);
                        return callback(err);
                    }
                });

                connection.query(`UPDATE detalle_factura df SET df.devuelto = TRUE WHERE df.numFactura = ${datos.numFactura} AND df.idProducto = ${key.idProducto};`,
                [],
                    (err, rs, f) => {
                    if(err) {
                        console.log('Error: ', err);
                        return callback(err);
                    }
                });
           });
        }
        
  
        connection.query(`UPDATE adquisicion_comprobante ac SET ac.secuencia = (ac.secuencia)+1 WHERE ac.tipoComprobante = 4 AND ac.estado IS TRUE`,
          [],
          (error, resultAdquisicion, fields) => {
            if(error) {
              console.log('Error: UPDATE: ', error);
              return error;
            }
          });
          
        return callback(null, results);
    });
  }

exports.getCxPProveedor = async (idProveedor, callback) => {
    try {
        connection.query(`
        SELECT 
        pv.idProveedor,
        COALESCE(pv.nombre, pv.razonSocial) AS proveedor,
        pv.correo,
        pv.telefono,
        COUNT(c.idCompra) AS facturasPendientes,
        ROUND(SUM((dc.precio * dc.cantidad)+dc.itbis),2) AS montoPendiente 
        FROM proveedor_v pv
        INNER JOIN compra c ON c.idProveedor = pv.idProveedor
        INNER JOIN detalle_compra dc ON c.idCompra = dc.idCompra
        INNER JOIN almacen a ON c.idAlmacen = a.idAlmacen
        INNER JOIN estado e ON e.idEstado = c.idEstadoCompra
        LEFT JOIN pago_compra pc ON c.idCompra = pc.idCompra
        INNER JOIN tipo t ON t.idTipo = c.idTipoFactura
        WHERE t.idTipo = 14
        GROUP BY 1,2,3,4
        `,[],
        (error, results, fields) => {
            if(error) {
                console.log('Error: ', error);
                return callback(error);
            }

            return callback(null, results);
        })

    } catch (error) {   
        console.log('Error: ', error);
    }
}
