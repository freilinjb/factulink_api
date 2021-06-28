const { connection } = require("../config/database");

exports.getComprobantes = async (tipoComprobante, callback) => {
    
    let condicion  = tipoComprobante ? `WHERE c.tipoComprobante = ${tipoComprobante}` : '';
    try {
        connection.query(`
        SELECT 
            c.tipoComprobante,
            c.TipoCliente,
            c.encabezado,
            c.descripcion,
            c.tipo,
            c.tipoMovimiento,
            CASE WHEN c.mostrarCliente IS TRUE THEN 1 ELSE 0 END AS mostrarCliente,
            c.cantidadMinima,
            ac.vencimiento,
            ac.secuencia,
            CASE WHEN ac.estado IS TRUE THEN 1 ELSE 0 END AS estado
        FROM comprobante c
        LEFT JOIN adquisicion_comprobante ac ON c.tipoComprobante = ac.tipoComprobante
        ${condicion}
        `,
        [], 
        async (error, results, fields) => {
            return error  ? callback(error) : callback(null, results);
        })
    } catch (error) {
        console.log(error);
        return error  ? callback(error) : callback(null, results);
    }
}

exports.saveComprobantes = async (data, callback) => {
    try {
        connection.query(`INSERT INTO adquisicion_comprobante(tipoComprobante, idSucursal, idTipoDocumento, vencimiento, inicio, final, secuencia, creado_por) VALUES(?,?,?,STR_TO_DATE(?,'%m/%d/%Y'),?,?,?,?)`,
        [data.tipoComprobante, 
        data.idSucursal,
        data.idTipoDocumento,
        data.vencimiento,
        data.inicio,
        data.final,
        data.secuencia,
        data.creado_por],
        async (error, results, fields) => {
            return error ? callback(error) : callback(null, results);
        });
    } catch (error) {
        console.log('Error: ', error);
        return "Ah ocurrido un error interno";
    }
}

exports.updateComprobantes = async (data, callback) => {
    try {
        connection.query(`
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

        [data.tipoComprobante,
        data.idSucursal,
        data.idTipoDocumento,
        data.vencimiento,
        data.inicio,
        data.final,
        data.secuencia,
        1,
        data.estado,
        data.idAquisicion],
        async (error, results, fields) => {
            return error ? callback(error) : callback(null, results);
        });
    } catch (error) {
        console.log('Error: ', error);
        return "Ah ocurrido un error interno";
    }
}
