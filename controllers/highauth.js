const JWT = require('jsonwebtoken');

const secret = "omgaadadsadsadadsa";
module.exports = (req, res, next) => {
    try {
        const decoded = JWT.verify(req.cookies.access_token, secret);
        req.user_id = decoded.id;
        req.user_name = decoded.name;
        req.role = decoded.role;
        if (req.user_name == "admin" || req.role == 1) {

            next();
        }
    } catch (error) {
        return res.status(401).json({
            message: 'YOU ARE NOT VERIFIED!.'
        });
    }
}