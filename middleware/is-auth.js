const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader){
     req.isAuth = false;
     return next();
  }

  const token = authHeader.split(" ")[1];
  
  try {    
    const decodedToken = jwt.verify(token, "graphqlkey");
    if(!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.isAuth = true;
    req.userID = decodedToken.userID;
    req.email = decodedToken.email;
    return next();

  } catch (error) {
    req.isAuth = false;
     return next();
  }

}