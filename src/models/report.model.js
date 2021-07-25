const { connection } = require("../config/database");

exports.getInvoiceCurrent = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";
    let limit = "";

    condicion = data.numFactura ? `f.numFactura = ${data.numFactura}` : "";
    if (data.numFactura == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` AND CONCAT(f.numFactura, t.descripcion, f.NFC, DATE_FORMAT( f.fecha , '%Y-%m-%d %T'), COALESCE(rs.nombre, rs.razonSocial)) LIKE '%${data.search}%' `;
      }
      limit += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = idCliente ? `WHERE c.idCliente = ${idCliente}` : "";
    // console.log("condicion: ", condicion);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(f.numFactura) AS cantidad FROM factura_dia_actual f ${
        search ? " WHERE 1 = 1" + search : ""
      }`,
      [],
      async (error, results, fields) => {
        // total_page = results[0].cantidad;
        if (error) {
          console.error("error: ", error);
          return callback(error);
        }

        if (results.length > 0) {
          console.log("prueba: ", results);
          total_rows = results[0].cantidad;
        } else {
          total_rows = 0;
          console.log("length: ", results);
        }
        console.log("cantidad total: ", total_rows);
        connection.query(
          `SELECT 
            f.numFactura,
            t.descripcion AS tipoFactura, 
            f.NFC,
            DATE_FORMAT( f.fecha , '%Y-%m-%d %T') AS fecha, 
            COALESCE(rs.nombre, rs.razonSocial) AS cliente,
            COUNT(df.idProducto) AS cantidadProductom, 
            SUM((df.precio * df.cantidad) * 1.18) AS total
          FROM factura f
            INNER JOIN detalle_factura df ON f.numFactura = df.numFactura 
            INNER JOIN cliente c ON f.idCliente = c.idCliente
            INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
            INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
            WHERE DATE(f.fecha) = CURRENT_DATE() ${search}  
            GROUP BY 1,2,3,4 ${limit}
          `,
          [],
          (error, results, fields) => {
            console.log("Datos: ", results);
            // console.log('numFactura: ', Math.ceil(total_rows / data.limit));

            total_page =
              data.numFactura == null ? Math.ceil(total_rows / data.limit) : 1;
            console.log("total_page: ", total_rows);

            return error
              ? callback(error)
              : callback(null, results, total_page, total_rows);
          }
        );

        return total_page;
      }
    );

    console.log("cantidad: ", total_page);
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getInvoice = async (data, callback) => {
  try {
    console.log("Pruebas de envio de datos");
    let condicion = " WHERE 1 = 1 ";
    let search = "";
    let limit = "";

    if (data.numFactura == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      console.log("Validacion sin completar");
      if (data.cliente) {
        condicion += `  AND v.idCliente = ${data.cliente}`;
      }
      if (data.tipoFactura) {
        condicion += ` AND v.idTipoFactura = ${data.tipoFactura}`;
      }
      if (data.fechaDesde) {
        condicion += ` AND (STR_TO_DATE( v.fecha,'%Y-%m-%d') BETWEEN '${data.fechaDesde}' AND '${data.fechaHasta}')`;
      }
      limit = ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = idCliente ? `WHERE c.idCliente = ${idCliente}` : "";
    console.log("search: ", search);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(1) AS cantidad FROM factura_v2 v ${condicion}`,
      [],
      async (error, results, fields) => {
        // total_page = results[0].cantidad;
        if (error) {
          console.error("error: ", error);
          return callback(error);
        }

        if (results.length > 0) {
          console.log("prueba: ", results);
          total_rows = results[0].cantidad;
        } else {
          total_rows = 0;
          console.log("length: ", results);
        }

        console.log("Condicion: ", condicion);
        console.log("Search: ", limit);
        console.log("cantidad total: ", total_rows);
        connection.query(
          `SELECT
            * 
          FROM factura_v2 v
            ${condicion}
            ${limit}
          `,
          [],
          (error, results, fields) => {
            console.log("Error: ", error);
            // console.log('numFactura: ', Math.ceil(total_rows / data.limit));

            total_page =
              data.numFactura == null ? Math.ceil(total_rows / data.limit) : 1;
            console.log("total_page: ", total_rows);

            return error
              ? callback(error)
              : callback(null, results, total_page, total_rows);
          }
        );

        return total_page;
      }
    );

    console.log("cantidad: ", total_page);
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getClientesCuentasPorCobrar = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";

    condicion = data.idCliente ? `WHERE a.idCliente = ${data.idCliente}` : "";
    if (data.idCliente == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` WHERE concat(a.nombre,a.razonSocial, a.RNC, a.diasCredito, a.limiteCredito, a.correo, a.telefono) LIKE '%${data.search}%' `;
      }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(1) AS cantidad FROM cuentaPorCobrar_v c ${search}`,
      [],
      async (error, results, fields) => {
        console.log("getClienteCuentasPor: ", results);
        // total_page = results[0].cantidad;
        if (error) {
          console.error("error: ", error);
          return callback(error);
        }

        if (results.length > 0) {
          console.log("prueba: ", results);
          total_rows = results[0].cantidad;
        } else {
          total_rows = 0;
          console.log("length: ", results);
        }
        console.log("cantidad total: ", total_rows);
        connection.query(
          `SELECT 
              c.idCliente,
              u.urlFoto,
              rs.nombre,
              rs.razonSocial,
              t.descripcion AS telefono,
              c1.descripcion AS correo,
              i.descripcion AS identificacion,
              e.descripcion AS estado
            FROM cliente c
            LEFT JOIN urlfoto u ON u.idTercero = c.idTercero
            INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
            LEFT JOIN tercero_telefono tt ON tt.idTercero = rs.idTercero
            LEFT JOIN telefono t ON tt.idTelefono = t.idTelefono
            LEFT JOIN tercero_correo tc ON tc.idTercero = c.idTercero
            LEFT JOIN correo c1 ON tc.idCorreo = c1.idCorreo
            INNER JOIN factura f ON c.idCliente = f.idCliente
            INNER JOIN tipo t1 ON t1.idTipo = f.idTipoFactura
            INNER JOIN estado e ON f.idEstado = e.idEstado
            INNER JOIN identificacion i ON i.idTercero = c.idTercero
            WHERE t1.idTipo = 14
            GROUP BY 1
              ${search}  ${condicion}
          `,
          [],
          (error, results, fields) => {
            console.log("idProduct: ", Math.ceil(total_rows / data.limit));

            total_page =
              data.idCliente == null ? Math.ceil(total_rows / data.limit) : 1;
            console.log("total_page: ", total_rows);

            return error
              ? callback(error)
              : callback(null, results, total_page, total_rows);
          }
        );

        return total_page;
      }
    );

    console.log("cantidad: ", total_page);
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getFacturasPendientes = async (data, callback) => {
  console.log('Data:', data);
  connection.query(
    `SELECT  f.numFactura AS numFactura,
      t.idTipo AS idTipoFactura,
      t.descripcion AS tipoFactura,
      f.NFC AS NFC,
      DATE_FORMAT(f.fecha, '%Y-%m-%d %T') AS fecha,
      c.idCliente AS idCliente,
      DATE_FORMAT(DATE_ADD(f.fecha, INTERVAL c.diasCredito DAY),'%Y-%m-%d %T') AS vencimiento,
      DATEDIFF(CURRENT_TIMESTAMP() ,f.fecha) AS diferencia,
      COALESCE(rs.nombre, rs.razonSocial) AS cliente,
      i.descripcion AS identificacion,
      COUNT(df.idProducto) AS cantidadProductom,
      ROUND(SUM(((df.precio * df.cantidad) * 1.18)), 2) AS total,
      COALESCE(pg.pagado,0) AS pagado,
      (CASE WHEN (t.idTipo = 13) THEN 'Pagada' ELSE e.descripcion END) AS estado
      FROM factura f
      INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
      INNER JOIN cliente c ON f.idCliente = c.idCliente
      INNER JOIN identificacion i ON i.idTercero = c.idTercero
      INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
      INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
      INNER JOIN estado e ON f.idEstado = e.idEstado

      LEFT JOIN (
        SELECT dp.numFactura, SUM(dp.montoAplicado) AS pagado, dp.estado  FROM pago p
         INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
         INNER JOIN factura f ON dp.numFactura = f.numFactura
         WHERE f.idCliente = ${Number(data.idCliente)}
         GROUP BY 1,3
       ) AS pg ON pg.numFactura = f.numFactura

      WHERE t.idTipo = 14 AND c.idCliente = ${ Number(data.idCliente)} ${data.estado == 'pendiente' ? ' AND e.idEstado = 1 ' : data.estado == 'pagadas' ? 'AND e.idEstado = 2' : '' }
    GROUP BY f.numFactura,t.idTipo,t.descripcion,f.NFC
    `,
    [data.idCliente],
    (error, results, fields) => {
      console.log('Error: ', error);
      return error ? callback(error) : callback(null, results);
    }
  );
};

exports.getFacturasPendientes2 = async (idCliente) => {
  connection.query(
    `SELECT  f.numFactura AS numFactura,
      t.idTipo AS idTipoFactura,
      t.descripcion AS tipoFactura,
      f.NFC AS NFC,
      DATE_FORMAT(f.fecha, '%Y-%m-%d %T') AS fecha,
      c.idCliente AS idCliente,
      DATE_FORMAT(DATE_ADD(f.fecha, INTERVAL c.diasCredito DAY),'%Y-%m-%d %T') AS vencimiento,
      DATEDIFF(CURRENT_TIMESTAMP() ,f.fecha) AS diferencia,
      COALESCE(rs.nombre, rs.razonSocial) AS cliente,
      i.descripcion AS identificacion,
      COUNT(df.idProducto) AS cantidadProductom,
      ROUND(SUM(((df.precio * df.cantidad) * 1.18)), 2) AS total,
      COALESCE(pg.pagado,0) AS pagado,
      (CASE WHEN (t.idTipo = 13) THEN 'Pagada' ELSE e.descripcion END) AS estado
      FROM factura f
      INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
      INNER JOIN cliente c ON f.idCliente = c.idCliente
      INNER JOIN identificacion i ON i.idTercero = c.idTercero
      INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
      INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
      INNER JOIN estado e ON f.idEstado = e.idEstado

      LEFT JOIN (
        SELECT dp.numFactura, SUM(dp.montoAplicado) AS pagado, dp.estado  FROM pago p
         INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
         INNER JOIN factura f ON dp.numFactura = f.numFactura
         WHERE f.idCliente = ${idCliente}
         GROUP BY 1,3
       ) AS pg ON pg.numFactura = f.numFactura

      WHERE t.idTipo = 14 AND c.idCliente = ${idCliente}
    GROUP BY f.numFactura,t.idTipo,t.descripcion,f.NFC
    `,
    [idCliente],
    (error, results, fields) => {
      return error ? callback(error) : callback(null, results);
    }
  );
};

exports.getFacturasPorCliente = async (idCliente, callback) => {
  connection.query(
    `
      SELECT  
      f.numFactura AS numFactura,
      t.idTipo AS idTipoFactura,
      t.descripcion AS tipoFactura,
      f.NFC AS NFC,
      DATE_FORMAT(f.fecha, '%Y-%m-%d %T') AS fecha,
      c.idCliente AS idCliente,
      DATE_FORMAT(DATE_ADD(f.fecha, INTERVAL c.diasCredito DAY),'%Y-%m-%d %T') AS vencimiento,
      DATEDIFF(CURRENT_TIMESTAMP() ,f.fecha) AS diferencia,
      COALESCE(rs.nombre, rs.razonSocial) AS cliente,
      i.descripcion AS identificacion,
      COUNT(df.idProducto) AS cantidadProductom,
      ROUND(SUM(((df.precio * df.cantidad) * 1.18)), 2) AS total,
      ROUND(COALESCE(pg.pagado,0),2) AS pagado,
      (CASE WHEN (t.idTipo = 13) THEN 'Pagada' ELSE e.descripcion END) AS estado
      FROM factura f
      INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
      INNER JOIN cliente c ON f.idCliente = c.idCliente
      INNER JOIN identificacion i ON i.idTercero = c.idTercero
      INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
      INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
      INNER JOIN estado e ON f.idEstado = e.idEstado

      LEFT JOIN (
        SELECT dp.numFactura, SUM(dp.montoAplicado) AS pagado, dp.estado  FROM pago p
         INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
         INNER JOIN factura f ON dp.numFactura = f.numFactura
         WHERE f.idCliente = ${idCliente}
         GROUP BY 1,3
       ) AS pg ON pg.numFactura = f.numFactura

      WHERE t.idTipo = 14 AND c.idCliente = ${idCliente}
    GROUP BY f.numFactura,t.idTipo,t.descripcion,f.NFC
    ORDER BY 1;
  `,
    [],
    (error, results, fields) => {
      return error ? callback(error) : callback(null, results);
    }
  );
};

exports.savePago = async (data, callback) => {
  try {

    // return;
    connection.beginTransaction((error) => {
      if (error) {
        return connection.rollback(() => {
          throw error;
        });
      }
      console.log('Error: ', data);
      connection.query(
        `INSERT INTO pago(idUsuario, idCliente, fecha, monto, idFormaPago, idBanco, observacion)
    VALUES(?,?,DATE_FORMAT(?,'%Y-%m-%d %T'),?,?,?,?)`,
        [
          1,
          data.idCliente,
          data.fecha,
          data.monto.toFixed(2),
          data.formaPago, //La funcion verifica el tipo de comprobante
          1, //La funcion verifica el tipo de comprobante
          data.idBanco ? data.idBanco : 1,
          data.observacion,
        ],
        (error, result, fields) => {
          if (error) {
            return connection.rollback(() => {
              console.log("Error2: ", error);
              return error;
            });

          }

          idPago = result.insertId;
          // console.log('Pago: ', idPago);

          data.facturas.forEach((factura, index) => {
            const { numFactura, abonar, estado } = factura;
            // const numFactura = result.insertId;
            console.log(`INSERT ${result.insertId} added`);

            if(estado == 2) {
              connection.query(
                `UPDATE factura f SET f.idEstado = 2 WHERE f.numFactura = ${numFactura}`,
                [],
                (er, rs, fields) => {
                  // console.log('Resultados: ', rs);
                }
              );
            }

            connection.query(
              `INSERT INTO detalle_pago(idPago, numFactura, montoAplicado) VALUES(?,?,?)`,
              [idPago, numFactura, abonar],
              (er, rs, fields) => {
                if (er) {
                  console.log("Error: ", er);
                  return connection.rollback(() => {
                    return callback(er);
                  });
                }
              }
            );
          });

          return callback(null, idPago);

          // connection.commit((err) => {
          //   if (err) {
          //     return connection.rollback(() => {
          //       return callback(err);
          //     });
          //   }
          // });
          // return callback(null, result);
        }
      );
    });
  } catch (error2) {
    console.log("Error: ", error2);
  }
};


exports.getPagos = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";

    condicion = data.idPago ? `WHERE v.idPago = ${data.idPago}` : "";
    if (data.idPago == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` WHERE concat(v.idPago, v.fecha, v.cliente, v.factura, v.formaPago, v.monto) LIKE '%${data.search}%' `;
      }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = idPago ? `WHERE c.idPago = ${idPago}` : "";
    // console.log("condicion: ", condicion);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(v.idPago) AS cantidad FROM pago_v v ${search}`,
      [],
      async (error, results, fields) => {
       // total_page = results[0].cantidad;
       if(error) {
        console.error("error: ", error);
        return callback(error);
       }

       if(results.length > 0) {
         console.log('prueba: ', results);
        total_rows = results[0].cantidad;
       } else {
        total_rows = 0;
        console.log('length: ', results);

       }
        console.log('cantidad total: ', total_rows);
        connection.query(
              `SELECT 
                v.idPago,
                v.fecha,
                v.cliente,
                v.fecha,
                v.factura,
                v.formaPago,
                v.monto 
              FROM pago_v v
              ${search}  ${condicion}
          `,
          [],
          (error, results, fields) => {
            console.log('idProduct: ', Math.ceil(total_rows / data.limit));
            
            total_page = data.idPago == null ? Math.ceil(total_rows / data.limit) : 1;
            console.log("total_page: ", total_rows);

            return error  ? callback(error)  : callback(null, results, total_page, total_rows);
          }
        );

        return total_page;
      }
    );

    console.log("cantidad: ", total_page);
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getPagoPorID = async(idPago, callback) => {
  connection.query(`
          SELECT 
          p.idPago,
          f1.descripcion AS formaPago,
          CONCAT(p1.nombre, ' ', p1.apellido) AS usuario,
          f.numFactura,
          ptotal.monto,
          ptotal.pagoAplicado,
          ptotal.monto - ptotal.pagoAplicado AS balance,
          ROUND((ptotal.pagoAplicado/ ptotal.monto)*100,2)  AS cumplimiento
          FROM pago p
          INNER JOIN formapago f1 ON f1.idFormaPago = p.idFormaPago
          INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
          INNER JOIN factura f ON dp.numFactura = f.numFactura
          INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
          INNER JOIN cliente c ON c.idCliente = p.idCliente
          INNER JOIN usuario u ON p.idUsuario = u.idUsuario
          INNER JOIN empleado e ON u.idEmpleado = e.idEmpleado
          INNER JOIN persona p1 ON e.idPersona = p1.idPersona
          INNER JOIN (
              SELECT 
              p.idPago, 
              dp.numFactura, 
              ROUND(SUM(df.precio * df.cantidad),2) AS monto,
              ROUND(dp.montoAplicado,2) AS pagoAplicado
            FROM pago p
            INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
            INNER JOIN detalle_factura df ON df.numFactura = dp.numFactura
            WHERE p.idPago = ${idPago}
            GROUP BY 1,2,4
          ) ptotal ON ptotal.numFactura = f.numFactura
          WHERE p.idPago = ${idPago}
          GROUP BY 1,2,3,4;
  `,[],
  (error, results, fields) => {
    return error ? callback(error) : callback(null, results);
  })
}

exports.getPagoPorFactura = async(numFactura, callback) => {
  connection.query(`
            SELECT 
            p.idPago,
            f1.descripcion AS formaPago,
            u.usuario,
            COALESCE(rs.nombre, rs.razonSocial) AS cliente,
            f.numFactura,
            e.descripcion AS estadoFactura,
            ptotal.monto,
            ptotal.pagoAplicado,
            ptotal.monto - ptotal.pagoAplicado AS balance,
            ROUND((ptotal.pagoAplicado/ ptotal.monto)*100,2)  AS cumplimiento
            FROM pago p
          INNER JOIN formapago f1 ON f1.idFormaPago = p.idFormaPago
          INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
          INNER JOIN factura f ON dp.numFactura = f.numFactura
          INNER JOIN estado e ON f.idEstado = e.idEstado
          INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
          INNER JOIN cliente c ON c.idCliente = p.idCliente
          INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
          INNER JOIN usuario u ON p.idUsuario = u.idUsuario
          INNER JOIN (
                SELECT 
                p.idPago, 
                dp.numFactura, 
                ROUND(SUM(df.precio * df.cantidad),2) AS monto,
                ROUND(dp.montoAplicado,2) AS pagoAplicado
              FROM pago p
              INNER JOIN detalle_pago dp ON p.idPago = dp.idPago
              INNER JOIN detalle_factura df ON df.numFactura = dp.numFactura
              WHERE df.numFactura = ${numFactura}
              GROUP BY 1,2,4
          ) ptotal ON ptotal.numFactura = f.numFactura
          WHERE dp.numFactura = ${numFactura}
          GROUP BY 1,2,3,4;
  `,[],
  (error, results, fields) => {
    return error ? callback(error) : callback(null, results);
  })
}