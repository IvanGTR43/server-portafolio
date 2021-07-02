const jwt = require("../services/jwt");
const bycript = require("bcrypt-nodejs");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

function signUp(req, res){
    const user = new User();
    const{ email, name, lastname, password, repeatPassword } = req.body;
    console.log(lastname);
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;

    if(!password || !repeatPassword){
        res.status(404).send({message: "Las Contraseñas son Obligatorias"});
    }else{
        if(password !== repeatPassword){
            res.status(404).send({message: "Las contraseña no coinciden"});
        }else{
            bycript.hash(password, null, null, function(err, hash){
                if(err){
                    res.status(500).send({message: "Error al Encriptar la contraseña"});
                }else{
                    user.password = hash;
                    user.save((err, userStored)=>{
                        if(err){
                            res.status(500).send({message: "El usuario ya existe"});
                        }else{
                            if(!userStored){
                                res.status(404).send({message: "Error al Crear el usuario"});
                            }else{
                                res.status(200).send({user: userStored});
                            }
                        }
                    });
                }
            })
            //res.status(200).send({message: "Usuatio Creado"});
        }
    }
}

function signIn(req, res){
  const params = req.body;
  const email = params.email.toLowerCase();
  const pass = params.password;

  User.findOne({email}, (err, userStored) => {
    if(err){
      res.status(500).send({message: "error del servidor"});
    }else{
      if(!userStored){
        res.status(404).send({message: "Usuario no encontrado"})
      }else{
        bycript.compare(pass, userStored.password, (err, check)=> {
          if(err){
            res.status(500).send({message: "error del servidor"})
          }else if(!check){
            res.status(500).send({message: "Contraseña Incorrecta"})
          }else{
            if(!userStored.active){
              res.status(200).send({message: "El usuario no esta Activo por el Administrador"});
            }else{
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored)
              });
            }
          }
        })
      }
    }
  });
}

function getUsers(req, res){
  User.find().then(users =>{
    if(!users){
      res.status(404).send({message: "No se ha encontrado ningun Usuario"});
    }else{
      res.status(200).send({users});
    }
  }).catch(err => {
      res.status(500).send({message: "Error del Servidor"});
  })
};

function getUsersActive(req, res){
  const query = req.query;
  User.find({active: query.active}).then(users =>{
    if(!users){
      res.status(404).send({message: "No se ha encontrado ningun Usuario Activo"});
    }else{
      res.status(200).send({users});
    }
  }).catch(err => {
      res.status(500).send({message: "Error del Servidor"});
  });
};

function uploadAvatar(req, res){
  const params = req.params;
  User.findById({_id: params.id}, (err, userData) => {
    if(err){
      res.status(500).send({message: "Error del Servidor"})
    }else{
      if(!userData){
        res.status(404).send({message: "NO se ha encontrado ningun Usuario"});
      }else{
        let user = userData;
        if(req.files){
          let filePath = req.files.avatar.path;
          //console.log( "gfgfgf" + filePath);
          let fileSplit = filePath.split("\\");
          let fileName = fileSplit[2];
          let extSplit = fileName.split(".");

          let fileExt = extSplit[1];
          //console.log(fileExt);
          if(fileExt !== "png" && fileExt !== "jpg"){
            res.status(400).send({message: "La extension de la Imagen no es Valida"});
          }else{
            user.avatar = fileName;
            User.findByIdAndUpdate({_id: params.id}, user, (err, userResult) =>{
              if(err){
                res.status(500).send({message: "Error del Servidor"});
              }else{
                if(!userResult){
                  res.status(404).send({message: "No Se ha encontrado ningun Usuario"});
                }else{
                  res.status(200).send({user: userResult});
                  console.log(userResult);
                }
              }
            });
          }
        }
      }
    }
  });
}

function getAvatar(req, res){
  const avatar = req.params.avatarName;
  //console.log(avatar);
  const filePath = "./uploads/avatar/" + avatar;
  fs.access(filePath, exists => {
    if(exists){
      res.status(404).send({message: "El Avatar que buscas no existe"});
    }else{
      res.sendFile(path.resolve(filePath));
    }
  })
}

async function updateUser(req, res){
  var userData = req.body;
  if(userData.avatar){
    userData.avatar = req.body.avatar.path;
}

  userData.email = req.body.email.toLowerCase();
  const params = req.params;

  if(userData.password){
    await bycript.hash(userData.password, null, null, (err, hash)=>{
      if(err){
        res.status(500).send({message: "Error al Encriptar la contraseña,"});
      }else{
        userData.password = hash;
      }
    });
  }
  //console.log(userData);
  User.findByIdAndUpdate({_id: params.id}, userData, (err, userUpdate) => {
    if(err){
      res.status(500).send({message: "Error del Servidor"});
    }else{
      if(!userUpdate){
        res.status(404).send({message: "Usuario no Encontrado"});
      }else{
        res.status(200).send({message: "Usuario Actualizado Correctamente"});
      }
    }
  });

};

function activateUser(req, res){
  const { id } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate({_id: id}, {active}, (err, userStored)=>{
    if(err){
      res.status(500).send({message: "Error del Servidor"});
    }else{
      if(!userStored){
        res.status(404).send({message: "No se ha encontrado el Usuario"});
      }else{
        if(active === true){
          res.status(200).send({message: "Usuario Activado Correctamente"});
        }else{
          res.status(200).send({message: "Usuario Desctivado"});
        }
      }
    }
  } )
};
function deleteUser(req, res){
  const { id } = req.params;
  User.findOneAndRemove({_id: id}, (err, userDelete) => {
    if(err){
      res.status(500).send({message: "Error del Servior"});
    }else{
      if(!userDelete){
        res.status(404).send({message: "Usuario no encontrado"});
      }else{
        res.status(200).send({message: "Usuario Eliminado Correctamente"});
      }
    }
  })
}


function signUpAdmin(req, res){
  const user = new User();
  const { name, lastname, email, role, password } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = role;
  user.active = true;
  bycript.hash(password, null, null, (err, hash) => {
    if(err){
      res.status(500).send({message: "Error al encriptar la contraseña"});
    }else{
      user.password = hash;
      user.save((err, userStored)=>{
        if(err){
          res.status(500).send({message: "El Usuario ya existe"});
        }else{
          if(!userStored){
            res.status(500).send({
              message: "Error al crear el Usuario"
            });
          }else{
            res.status(200).send({user: userStored});
          }
        }
      })
    }
  });

}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin
};