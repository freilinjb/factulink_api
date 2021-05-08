const { verify } = require('jsonwebtoken');

module.exports = { 
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        //console.log(`token:[${token}]`);
        if(token) {
            token = token.slice(7);
            verify(token, "qw1234", (err, decoded) =>{
                if(err) {
                    console.log('Invalid token');
                    res.status(401).json({
                        success: 0,
                        message: "Invalid token"
                    });
                } else {
                    next();
                }
                
            });
        } else {
            console.log('Access denied! unautorized user');
            res.json({
                success: 0,
                message: "Access denied! unautorized user"
            })
        }
    }
}