const Post = require("../models/post");

function addPost(req, res){
  const body = req.body;
  const post= new Post(body);
  post.save((err, postStared) => {
    if(err){
      res.status(500).send({
        code: 500,
        message: "Error del Servidor"
      })
    }else{
      if(!postStared){
        res.status(400).send({
          code: 400,
          message: "No se ha podido crear el post"
        });
      }else{
        res.status(200).send({
          code: 200,
          message: "Post Creado Correctamente"
        });
      }
    }
  });
}
function getPosts(req, res){
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page,
    limit: parseInt(limit),
    sort: { date: "desc" }
  }
  Post.paginate({}, options, (err, postsStored) => {
    if(err){
      res.status(500).send({
        code: 500,
        message: "Error del Servidor"
      });
    }else{
      if(!postsStored){
        res.status(404).send({
          code: 404,
          message: "NO se Encontro ningun Post"
        })
      }else{
        res.status(200).send({
          code: 200,
          post: postsStored
        });
      }
    }
  })
};
function updatePost(req, res){
  const postData = req.body;
  const { id } = req.params;

  Post.findByIdAndUpdate(id, postData, (err, postUpdated) => {
    if(err){
      res.status(500).send({
        code: 500,
        message: "Error del Servidor"
      });
    }else{
      if(!postUpdated){
        res.status(404).send({
          code: 404,
          message: "Post No encontrado"
        })
      }else{
        res.status(200).send({
          code: 200,
          message: "Post Actualizado Correctamente"
        });
      }
    }
  })
};
function deletePost(req, res){
  const { id } = req.params;
  Post.findByIdAndRemove(id, (err, postDeleted) => {
    if(err){
      res.status(500).send({
        code: 500,
        message: "Error del Servidor"
      })
    }else{
      if(!postDeleted){
        res.status(404).send({
          code: 404,
          message: "NO se encontro ningun post"
        })
      }else{
        res.status(200).send({
          code: 200,
          message: "Post Eliminado"
        })
      }
    }
  }) 

  
}; 
function getPost(req, res){
  const { id } = req.params;

  Post.findById(id, (err, postStored) => {
    if(err){
      res.status(500).send({
        code: 500,
        message: "Error del Servidor"
      })
    }else{
      if(!postStored){
        res.status(404).send({
          code: 404,
          message: "No se encontro ningun post"
        })
      }else{
        res.status(200).send({
          code: 200,
          post: postStored
        })
      }
    }
  })
}
module.exports = {
  addPost,
  getPosts,
  updatePost,
  deletePost,
  getPost
}