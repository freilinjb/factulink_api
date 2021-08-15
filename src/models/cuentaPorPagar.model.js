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

exports.getCuentaPorPagarPorProveedor = async (idProveedor, callback) => {
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
        COALESCE(SUM(pc.monto),0) AS pagado,
        CASE WHEN c.garantia IS TRUE THEN 1 ELSE 0 END AS garantia, 
        e.descripcion AS estado 
        FROM compra c
        INNER JOIN detalle_compra dc ON c.idCompra = dc.idCompra 
        INNER JOIN proveedor_v pv ON pv.idProveedor = c.idProveedor
        INNER JOIN almacen a ON c.idAlmacen = a.idAlmacen
        LEFT JOIN pago_compra pc ON c.idCompra = pc.idCompra
        INNER JOIN estado e ON e.idEstado = c.idEstadoCompra
        WHERE pv.idProveedor = ${idProveedor}
        GROUP BY 1,2,3,4,5,6,7,8,11,12
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

exports.getCuentaPorPagar = async (data, callback) => {
    try {
        let condicion = null;
        let search = '';

        condicion = data.idProveedor ? `WHERE p.idProveedor = ${data.idProveedor}`   : "";
        // condicion = (idProveedor) ? ` WHERE p.idProveedor = ${idProveedor}` : '';
        if(data.idProveedor == null && data.limit && data.offset >= 0) {
            if(data.search) {
                data.search = data.search.trim();
                search = ` WHERE CONCAT(v.idCompra, v.documento, v.fecha, v.almacen, v.proveedor, v.RNC, v.telefono, v.correo, v.estado) LIKE '%${data.search}%'`;
            }
            condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
        }

        let total_page = 0;
        let total_rows = 0;

        console.log('busqueda: ', search);
        console.log('condicion: ', condicion);
        connection.query(
            `SELECT COUNT(v.idCompra) AS cantidad FROM cuenta_por_pagar_v v ${search}`,
            [],
            async (error, results, fields) => {

                if(error) {
                    console.log('Error: ', error);
                    return callback(error);
                }
                if(results.length > 0) {
                    console.log('prueba: ', results);
                    total_rows = results[0].cantidad;
                } else {
                    total_rows = 0;
                    console.log('prueba: ', results);
                }

                console.log('cantidad total: ', total_rows);
                connection.query(`
                SELECT 
                    c.idCompra, 
                    c.documento, 
                    c.fecha,
                    a.descripcion AS almacen,
                    COALESCE(pv.nombre, pv.razonSocial) AS proveedor, 
                    pv.RNC, 
                    pv.telefono, 
                    pv.correo, 
                    SUM(dc.precio * dc.cantidad) AS total,
                    CASE WHEN c.garantia IS TRUE THEN 1 ELSE 0 END AS garantia, 
                    e.descripcion AS estado 
                FROM compra c
                INNER JOIN detalle_compra dc ON c.idCompra = dc.idCompra 
                INNER JOIN proveedor_v pv ON pv.idProveedor = c.idProveedor
                INNER JOIN almacen a ON c.idAlmacen = a.idAlmacen
                INNER JOIN estado e ON e.idEstado = c.idEstadoCompra
                ${search} 
                GROUP BY 1,2,3,4,5,6,7,8,10,11 
                ORDER BY 1 ${condicion}
                
                `,
                [], 
                (error, results, fields) => {
                    console.log('idCompra: ', Math.ceil(total_rows/data.limit));
                    total_page = data.idCompra == null ? Math.ceil(total_rows / data.limit) : 1;
                    console.log('total_page2: ', data.idCompra);

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

exports.getCxPProveedor = async (idProveedor, callback) => {
    try {
        let condicion = idProveedor ? ` AND pv.idProveedor ${idProveedor}` : '';
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
        WHERE t.idTipo = 14 ${condicion}
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

exports.pagarFactura = async = (datos, callback) => {
    
    console.log('Datos: ', datos);
    // return;
    connection.query(`INSERT INTO pago_compra(idUsuario, idCompra, fecha, saldada, idFormaPago, monto, observacion)
    VALUES(?,?,CURRENT_DATE(), ?, ?, ?, ?)`,
    [
        datos.idUsuario,
        datos.idCompra,
        datos.saldado,
        datos.idFormaPago,
        datos.monto,
        datos.observacion,
    ],
    (error, results, fields) => {
        if(error) {
            console.log('Error: ', error);
            return callback(error);
        }

        if(datos.saldado == true) {
            connection.query(`UPDATE compra c SET c.idEstadoCompra = 2 WHERE c.idCompra = ${datos.idCompra}`,
            [],
            (err, rs, f) => {
                if(err) {
                    console.log('Error: ', err);
                    return callback(err);
                }
            });
        }
        return callback(null, results);
    });
}