const { connection } = require('../config/database');

exports.getProvince = async (data, callback) => {
    try {
      let condicion = '';
      let search = '';
  
      // console.log(`prueba: ${data.limit}, ${data.offset}`);
  
  
      condicion = data.idProvincia ? `WHERE p.idProveedor = ${data.idProvincia}`   : "";
      if (data.idProvincia == null && data.limit && data.offset >= 0) {
  
        //Valida si es una busqueda que se va arelizar
        if(data.search) {
    
          data.search = data.search.trim();
          search = ` WHERE CONCAT(p.idProvincia, p.descripcion) LIKE '%${data.search}%' `; 
        }
        condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
      }
  
      
      let total_page = 0;
      let total_rows = 0;
      connection.query(
        `SELECT COUNT(p.idProvincia) AS cantidad  FROM provincia p ${search}`,
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
                `SELECT p.idProvincia, 
                  p.descripcion  AS provincia, 
                  CASE WHEN p.estado IS TRUE THEN 1 ELSE 0 END AS estado
                FROM provincia p
                ${search}  ${condicion}`,
            [],
            (error, results, fields) => {
              console.log('idProvincia: ', Math.ceil(total_rows / data.limit));
              
              total_page = data.idProvincia == null ? Math.ceil(total_rows / data.limit) : 1;
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

  exports.getProvinceByID = async (idProvincia, callback) => {
    try {
        connection.query(`
        SELECT p.idProvincia, 
            p.descripcion  AS provincia, 
            CASE WHEN p.estado IS TRUE THEN 1 ELSE 0 END AS estado
          FROM provincia p
        WHERE p.idProvincia = ?`,
      [idProvincia],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      })
    } catch (error) {
        console.error("error: ", error);
        return "Ah ocurrido un error";
    }
}