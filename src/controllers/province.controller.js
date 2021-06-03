const province = require('../models/province.model');

exports.getProvince = (req, res) => {
    let idProvincia = null;
    let data = {};
  
    idProvincia = req.params.idProvincia ? req.params.idProvincia : null;
    //const prueba = req.query.prueba;
    console.log('req: prueba: ', req.query.page);
    data.idProvincia = idProvincia;
    data.page = req.query.page;
    data.search = req.query.search;
    data.limit = req.query.limit;
    console.log('data: ', data);
    if(!data.limit) {
      data.limit = 20;
    }
    data.offset = (data.page -1 ) * data.limit;
    province.getProvince(data, (err, results, total_page, total_rows) => {
      if (err) {
        console.log('error: ', err);
        return res.status(500).json({
          error: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }
  
      if(data.page) {
        return res.status(200).json({
          success: 1,
          data: {
            total_page : Math.ceil(total_page),
            page_cout: results.length,
            page_number: Number(data.page),
            total_rows: Number(total_rows),
            results: results,
          },
        });
      } 
  
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  };

  exports.getProvinceByID = (req, res) => {
    console.log('prueba');
    let idProvincia = req.params.idProvincia;
    console.log('idProvincia: ', idProvincia);
    province.getProvinceByID(idProvincia, (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }
  
      return res.status(200).json({
        success: 1,
         data: results,
      });
    })
  }