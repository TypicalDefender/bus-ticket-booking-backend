const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).send('Access Denied. No token provided');
    }
    try{
      const decoded = jwt.verify(token, "jwtPrivateKey");
      req.user = decoded;
      next();
    }
    catch(err){
       return res.status(403).send("Access denied. Try the token again");
    }
}
