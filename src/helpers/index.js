const multer = require('multer');
const { verify } = require('jsonwebtoken');

/**
 * CONSULTAR EL ID DEL USAURIO QUE REALIZA LA CONSULTA, QUE ESTA EN EL TOKEN
 */
const getUserByToken = (token) => {
  token = token.replace("Bearer ", "");
    return verify(token,"qw1234").result.idUsuario;
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './src/uploads/img/product');
    },
    filename: (req, file, callback) => {
        callback(null, `${Math.random(0,1).toString().substr(2)}${file.originalname}`);
    }
});

const fileFilterImg = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
};


const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilterImg
});


module.exports = {
    storage,
    fileFilterImg,
    upload,
    getUserByToken
}