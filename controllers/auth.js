const JWT = require('jsonwebtoken');

const secret = "omgaadadsadsadadsa";
module.exports = (req, res, next)=>{
    try{
        const decoded = JWT.verify(req.cookies.access_token, secret);
        req.buyer_id = decoded.id;
        req.buyer_name = decoded.name;
        req.bank_id = decoded.bank_id;
        next();
    }catch (error){
        return res.status(401).json({
            message:'YOU ARE NOT VERIFIED!.'
        });
    }
}