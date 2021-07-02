const Course = require("../models/courses");

function addCourse(req, res){
  const body = req.body;
  const course = new Course(body);
  course.order= 1000;

  course.save((err, courseStored)=> {
    if(err){
      res.status(500).send({
        message: "Error del Servidor",
        code: 500
      })
    }else{
      if(!courseStored){
        res.status(404).send({
          message: "No se ha podido crear el curso",
          code: 404
        });
      }else{
        res.status(200).send({
          message: "Curso Agregado Correctamente",
          code: 200
        });
      }
    }
  })
}

function getCourses(req, res){
  Course.find().sort({order: "asc"}).exec((err, courseStored) => {
    if(err){
      res.status(500).send({
        message: "Error del Servidor"
      })
    }else{
      if(!courseStored){
        res.status(404).send({
          message: "No se encontarron Cursos",
          code: 404
        })
      }else{
        res.status(200).send({
          code: 200,
          courses: courseStored
        })
      }
    }
  })
};

function deleteCourse(req, res){
  const {id} = req.params;
  Course.findOneAndRemove({_id: id}, (err, courseStored) => {
    if(err){
      res.status(500).send({
        message: "Error del Servidor",
        code: 500
      })
    }else{
      if(!courseStored){
        res.status(404).send({
          message: "No se Encontro el Curso",
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
};

function updateCourse(req, res){
  let courseData = req.body;
  const { id } = req.params;
  Course.findOneAndUpdate({_id: id}, courseData, (err, courseStored)=> {
    if(err){
      res.status(500).send({
        message: "Error del Servidor",
        code: 500
      });
    }else{
      if(!courseStored){
        res.status(404).send({
          message: "Curso no encontrado",
          code: 404
        });
      }else{
        res.status(200).send({
          code: 200,
          message: "Cusro Actualizado Correctamente"
        });
      }
    }
  })
}
module.exports= {
  addCourse,
  getCourses,
  deleteCourse,
  updateCourse
}