const { connection } = require('../config/database');

exports.getSupplier = async (data, callback) => {
    try {
        let condicion = null;
        let search = '';

        condicion = data.idProveedor ? `WHERE p.idProveedor = ${data.idProveedor}`   : "";
        // condicion = (idProveedor) ? ` WHERE p.idProveedor = ${idProveedor}` : '';
        if(data.idProveedor == null && data.limit && data.offset >= 0) {
            if(data.search) {
                search = ` WHERE CONCAT(p.nombre, p.razonSocial, p.correo,p.telefono, p.ciudad) LIKE '%${search}%'`;
            }
            condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
        }

        let total_page = 0;
        let total_rows = 0;

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

exports.addSupplier = async (data, callback) => {
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
