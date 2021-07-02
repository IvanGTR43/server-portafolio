const NewsLetter = require("../models/newsletter");

function suscribeEmail(req, res){
  const email = req.params.email;
  const newsletter = new NewsLetter();

  if(!email){
    res.status(404).send({message: "El email es obligatorio", code: 400});
  }else{
    newsletter.email = email.toLowerCase();
    newsletter.save((err, newsletterStorage) => {
      if(err){
        res.status(500).send({code: 500, message: "Correo ya existe"});
      }else{
        if(!newsletterStorage){
          res.status(404).send({code: 404, message: "Error al registrar el Correo"});
        }
        else{
          res.status(200).send({code: 200, message: "Registro Correcto"});
        }
      }
    });
  }

}

module.exports = {
  suscribeEmail
}