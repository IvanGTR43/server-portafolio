const jwt = require("../services/jwt");
const moment = require("moment");
const user = require("../models/user");

function willExpiredToken(token){
  const { exp } = jwt.decodeToken(token);
  const currentDate = moment.unix();

  if(currentDate > exp){
    return true;
  }
  return false;
}

function refreshAccessToken(req, res){
  const { refreshToken } = req.body;
    const ifTokenExpired = willExpiredToken(refreshToken);
    if(ifTokenExpired){
      res.status(404).send({message: "el refreshToken a Expirado"});
    }else{
      const {id} = jwt.decodeToken(refreshToken);
      user.findOne({_id: id}, (err, userStorage) => {
        if(err){
          res.status(500).send({message: "Error del servidor"});
        }else{
          if(!userStorage){
            res.status(404).send({message: "Usuario no Encontrado"});
          }else{
            res.status(200).send(
              {
                accessToken: jwt.createAccessToken(userStorage),
                refreshToken: refreshToken
              }
            );
          }
        }
      });
    }

};
module.exports = {
  refreshAccessToken
}