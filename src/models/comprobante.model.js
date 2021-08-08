const { connection } = require("../config/database");

exports.getComprobantes = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";
    condicion = data.tipoComprobante ? `WHERE tipoComprobante = ${data.tipoComprobante}` : "";
    if (data.tipoComprobante == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` WHERE CONCAT(tipoComprobante, TipoCliente, encabezado, descripcion, tipo, tipoMovimiento, mostrarCliente, cantidadMinima, vencimiento, secuencia, estado) LIKE '%${data.search}%' `;
      }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = tipoComprobante ? `WHERE c.tipoComprobante = ${tipoComprobante}` : "";
    // console.log("condicion: ", condicion);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(c.tipoComprobante) AS cantidad FROM comprobante_v c ${search}`,
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
                tipoComprobante,
                tipoCliente, 
                encabezado, 
                descripcion, 
                tipo, 
                tipoMovimiento, 
                mostrarCliente, 
                cantidadMinima, 
                vencimiento, 
                secuencia, 
                estado 
            FROM comprobante_v
                  ${search}  ${condicion}
              `,
          [],
          (error, results, fields) => {
            console.log("idProduct: ", Math.ceil(total_rows / data.limit));

            total_page = data.idCliente == null ? Math.ceil(total_rows / data.limit) : 1;
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

exports.getComprobasByTipo = async (tipoComprobante, callback) => {
  connection.query(`
  SELECT  ac.idAquisicion,c.tipoComprobante, ac.vencimiento,c.descripcion,c.encabezado, c.tipo, c.cantidadMinima, ac.inicio, ac.final, SUM(ac.final - ac.inicio) AS adquirida, ac.secuencia, CASE WHEN ac.estado IS TRUE THEN 1 ELSE 0 END AS estado FROM comprobante c
  INNER JOIN adquisicion_comprobante ac ON c.tipoComprobante = ac.tipoComprobante
  WHERE c.tipoComprobante = ${tipoComprobante}
  GROUP BY 1,2,3,4,5,6,7,8,9,11,12
  `,
  [], 
  (error, results, fields) => {
    return (error) ? callback(error) : callback(null, results);
  });
}



exports.saveComprobantes = async (data, callback) => {
  try {
    console.log('saveComprobantes: ', data);

    connection.query(
      `INSERT INTO adquisicion_comprobante(tipoComprobante, idSucursal, idTipoDocumento, vencimiento, inicio, final, secuencia, creado_por) VALUES(?,?,?,STR_TO_DATE(?,'%Y-%m-%d'),?,?,?,?)`,
      [
        data.tipoComprobante,
        data.idSucursal,
        data.idTipoDocumento,
        data.vencimiento,
        data.inicio,
        data.final,
        data.secuencia,
        data.creado_por,
      ],
      async (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error interno";
  }
};

exports.updateComprobantes = async (data, callback) => {
  try {
    connection.query(
      `
        UPDATE adquisicion_comprobante ac
            SET ac.tipoComprobante = ?,
            ac.idSucursal = ?, 
            ac.idTipoDocumento = ?, 
            ac.vencimiento =  STR_TO_DATE(?,'%m/%d/%Y'), 
            ac.inicio = ?, 
            ac.final = ?, 
            ac.secuencia = ?, 
            ac.actualizado_por = ?,
            ac.ultima_actualizacion = NOW(),
            ac.estado = ?
        WHERE ac.idAquisicion = ?`,

      [
        data.tipoComprobante,
        data.idSucursal,
        data.idTipoDocumento,
        data.vencimiento,
        data.inicio,
        data.final,
        data.secuencia,
        1,
        data.estado,
        data.idAquisicion,
      ],
      async (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error interno";
  }
};
