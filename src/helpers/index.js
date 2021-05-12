const multer = require('multer');

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
    upload
}