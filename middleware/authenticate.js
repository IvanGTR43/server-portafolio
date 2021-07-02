const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "TARI960620HPLcyv02";

exports.ensureAuth = (req, res, next)=>{
  if(!req.headers.authorization){
    return res.status(403).send({message: "La peticion no tiene Cabezera de Autenticación"});
  }
  const token = req.headers.authorization.replace(/['"]+/g,"");
  try{
    var payload = jwt.decode(token, SECRET_KEY);
    if(payload.exp <= moment.unix){
      return res.status(404).send({message: "El token ha expirado"});
    }
  }catch(err){
    console.log(err);
    return res.status(404).send({message: "Token Invalido"});
  }

  req.user = payload;
  next();
}