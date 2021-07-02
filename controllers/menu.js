const Menu = require("../models/menu");

function addMenu(req, res){
  const {title, url, order, active} = req.body;
  const menu = new Menu();
  menu.title = title;
  menu.url = url;
  menu.order = order;
  menu.active = active;

  menu.save((err, createdMenu)=> {
    if(err){
      res.status(500).send({message: "Error del Servidor"});
    }else{
      if(!createdMenu){
        res.status(404).send({message: "Error al Crear el menu"})
      }else{
        res.status(200).send({message: "Menu Creado Correctamente"});
      }
    }
  })
};

function getMenu(req, res){
  Menu.find().sort({order: "asc"}).exec((err, menuStored)=> {
    if(err){
      res.status(500).send({message: "Error del Servidor"});
    }else{
      if(!menuStored){
        res.status(404).send({message: "No se ha encontrado ningun elemento en el menu"})
      }
      else{
        res.status(200).send({menu: menuStored});
      }
    }
  })
};

function updateMenu(req, res){
  let menuData = req.body;
  const params = req.params;
  Menu.findByIdAndUpdate({_id: params.id}, menuData, (err, menuUpdate) => {
    if(err){
      res.tartus(500).send({message: "Error del Servidor"});
    }else{
      if(!menuUpdate){
        res.status(404).send({message: "No se ha encontrado ningun menu"});
      }else{
        res.status(200).send({message: "Menu Actulizado Correctamente"});
      }
    }
  });
};

function activateMenu(req, res){
  const { id } = req.params;
  const { active } = req.body;
  Menu.findByIdAndUpdate({_id: id}, active, (err, menuUpdate) => {
    if(err){
      res.status(500).send({message: "Error del Servidor"});
    }else{
      if(!menuUpdate){
        res.status(404).send({message: "No se ha encontrado nungun Menú"});
      }else{
        if(active === true){
          res.status(200).send({message: "Menu Activado Correctamente"});
        }else{
          res.status(200).send({message: "Menu Desactivado correctamente"});
        }
      }
    }
  });
};

function deleteMenu(req, res){
  const {id} = req.params;
  Menu.findByIdAndRemove({_id: id}, (err, menuDelete) => {
    if(err){
      res.status(500).send({message: "Error del Servior"});
    }else{
      if(!menuDelete){
        res.status(404).send({message: "Menu no encontrado"});
      }else{
        res.status(200).send({message: "Menu Eliminado Correctamente"});
      }
    }
  });
};
module.exports= {
  addMenu,
  getMenu,
  updateMenu,
  activateMenu,
  deleteMenu
};