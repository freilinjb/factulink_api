const { body, validationResult } = require("express-validator");


exports.prueba = async (req, res, next) => {

    console.log('prueba2:');

    return res.status(200).json({message: "asdfasdf"});
  //  console.log(req);
}