const { connection } = require('../config/database');

exports.getSupplier = async (idProveedor, callback) => {
    try {
        let condicion = null;

        condicion = (idProveedor) ? ` WHERE p.idProveedor = ${idProveedor}` : '';
        console.log('condicion: ', condicion);

        connection.query(`
        SELECT 
            p.idProveedor,
            COALESCE(rs.nombre,'') AS nombre,  
            rs.descripcion AS razonSocial, 
            c.descripcion AS correo,
            t.descripcion AS telefono,
            c1.descripcion AS ciudad,
            p1.descripcion AS provincia,
            p.observacion,
            CASE WHEN p.estado IS TRUE THEN 'activo' ELSE 'inactivo' END AS estado
        FROM proveedor p
            INNER JOIN razon_social rs ON rs.idTercero = p.idTercero
            INNER JOIN tercero_correo tc ON tc.idTercero = p.idTercero
            INNER JOIN correo c ON c.idCorreo = tc.idCorreo
            INNER JOIN tercero_direccion td ON td.idTercero = p.idTercero
            INNER JOIN tercero_telefono tt ON tt.idTercero = p.idTercero
            INNER JOIN telefono t ON t.idTelefono = tt.idTelefono
            INNER JOIN direccion d ON d.idDireccion = td.idDireccion
            INNER JOIN ciudad c1 ON c1.idCiudad = d.idCiudad
            INNER JOIN provincia p1 ON p1.idProvincia = d.idProvincia
            ${condicion}
        `,[], (error, results, fields) => {
            return error ? callback(error) : callback(null, results);
        });
    } catch (error) {
        console.error('error: ', error);
        return "Ah ocurrido un error";
    }
}




