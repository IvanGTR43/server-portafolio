const Project = require("../models/project");

function addProject(req, res){
  const body = req.body;
  const project= new Project(body);
  project.save((err, projectStored) => {
    if(err){
      res.status(500).send({
        message: "Error del Servidor",
        code: 500
      });
    }else{
      if(!projectStored){
        res.status(404).send({
          message: "Error al Agregar el Proyecto",
          code: 404
        });
      }else{
        res.status(200).send({
          message: "Proyecto agregado",
          code: 200
        })
      }
    }
  })
};
function deleteProject(req, res){
  const { id } = req.params;
  Project.findByIdAndRemove(id, (err, projectStored) => {
    if(err){
      res.status(500).send({
        message: "Error al Eliminar",
        code: 500
      });
    }else{
      if(!projectStored){
        res.status(404).send({
          message: "NO se Encontro Ningun Projecto",
          code: 404
        });
      }else{
        res.status(200).send({
          message: "Eliminado Correctamente",
          code: 200
        });
      }
    }
  });
}
function updateProject(req, res){
  const { id } = req.params;
  const body = req.body;
  Project.findByIdAndUpdate(id, body, (err, projectStored) => {
    if(err){
      res.status(500).send({
        message: "Error en el Servidor",
        code: 500
      });
    }else{
      if(!projectStored){
        res.status(404).send({
          message: "Proyecto no encontrado",
          code: 404
        });
      }else{
        res.status(200).send({
          message: "Proyecto Actualizado",
          code: 200
        })
      }
    }
  })
}

function getProjects(req, res){
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page,
    limit: parseInt(limit),
    sort: { date: "desc" }
  };
  Project.paginate({}, options, (err, projectStored) => {
    if(err){
      res.status(500).send({
        message: "Error del Servodr",
        code: 500
      });
    }else{
      if(!projectStored){
        res.status(404).send({
          message: "No se encontro ningun Proyecto",
          code: 404
        });
      }else{
        res.status(200).send({
          code: 200,
          projects: projectStored
        });
      }
    }
  });
}
function getProject(req, res){
  const { id } = req.params;

  Project.findById({_id : id}, (err, projectStored) => {
    if(err){
      res.status(500).send({
        message: "Error del Servodor",
        code: 500
      })
    }else{
      if(!projectStored){
        res.status(404).send({
          message: "No se Encontro Ningun Proyecto con ese nombre",
          code: 404
        });
      }else{
        res.status(200).send({
          project: projectStored,
          code: 200
        });
      }
    }
  })
}
module.exports = {
  addProject,
  deleteProject,
  updateProject,
  getProject,
  getProjects
}