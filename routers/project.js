const express = require("express");
const ProjectController = require("../controllers/project");
const md_auth = require("../middleware/authenticate");

const api = express.Router();

api.post("/add-project", [md_auth.ensureAuth], ProjectController.addProject);
api.delete("/delete-project/:id", [md_auth.ensureAuth], ProjectController.deleteProject);
api.put("/update-project/:id", [md_auth.ensureAuth], ProjectController.updateProject);
api.get("/get-project/:id", ProjectController.getProject);
api.get("/get-projects", ProjectController.getProjects);


module.exports = api;