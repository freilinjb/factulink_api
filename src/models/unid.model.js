const { connection } = require("../config/database");

exports.getUnid = async (data, callback) => {
  try {
    let condicion = null;
    let search = '';

    condicion = data.idUnidad ? `WHERE v.idUnidad = ${data.idUnidad}`   : "";
    if(data.idUnidad == null && data.limit && data.offset >= 0) {
      if(data.search) {
          data.search = data.search.trim();
          search = `  WHERE CONCAT(v.idUnidad, v.creado_por, v.creado_en, v.estado) LIKE '%${data.search}%'`;
      }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    
    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(v.idUnidad) AS cantidad FROM unidad_v v ${search}`,
      [],
      async (error, results, fields) => {
       // total_page = results[0].cantidad;
       if(results.length > 0) {
         console.log('prueba: ', results);
        total_rows = results[0].cantidad;
       } else {
        total_rows = 0;
        console.log('length: ', results);
       }
        console.log('cantidad total: ', total_rows);
        connection.query(
          `SELECT v.idUnidad, 
                  v.unidad, 
                  v.creado_por, 
                  v.creado_en, 
                  v.estado 
            FROM unidad_v v
              ${search}  ${condicion}`,
          [],
          (error, results, fields) => {
            console.log('idUnidad: ', Math.ceil(total_rows / data.limit));
            
            total_page = data.idUnidad == null ? Math.ceil(total_rows / data.limit) : 1;
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

exports.addUnid = async (data, callback) => {
  try {
    console.log('DataCategory: ', data);
    connection.query(`INSERT INTO unidad(descripcion, creado_por, estado) VALUES(?,?,?)`,
    [
      data.nombre,
      data.creado_por,
      data.estado,
    ],
    (error, result, fields) => {
      console.log('DataResultante: ', result);
      console.log('DataResultante: ', fields);
      return error ? callback(error) : callback(null, result);
    });
  } catch (error) {
    console.log('Error: ', error);
    return "Ah ocurrido un error interno";
  }
}

exports.deleteUnid = async (idUnidad, callback) => {
  try {
    console.log('DataUnidad: ', idUnidad);
    connection.query(`DELETE FROM unidad WHERE idUnidad = ?`,
    [idUnidad],
    (error, result, fields) => {
      return error ? callback(error) : callback(null, result);
    });
  } catch (error) {
    console.log('Error: ', error);
    return "Ah ocurrido un error interno";
  }
}

exports.updateUnid = async (data, callback) => {
  try {
    console.log('DataCategory: ', data);
    connection.query(`UPDATE unidad v SET v.descripcion = ?, v.estado = ? WHERE v.idUnidad = ?`,
    [
      data.nombre,
      data.estado,
      data.idUnidad,
    ],
    (error, result, fields) => {
      console.log('DataResultante: ', result);
      console.log('DataResultante: ', fields);
      return error ? callback(error) : callback(null, result);
    });
  } catch (error) {
    console.log('Error: ', error);
    return "Ah ocurrido un error interno";
  }
}