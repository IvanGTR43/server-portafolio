const express = require("express");
const userController = require("../controllers/user");
const multipart = require("connect-multiparty");

const md_auth = require("../middleware/authenticate");
const user = require("../models/user");
const md_upload_avatar = multipart({uploadDir: "./uploads/avatar"});

const api = express.Router();

api.post("/sign-up", userController.signUp);
api.post("/sign-in", userController.signIn);
api.get("/users", [md_auth.ensureAuth], userController.getUsers);
api.get("/users-active", [md_auth.ensureAuth], userController.getUsersActive);
api.put("/upload-avatar/:id", [md_auth.ensureAuth, md_upload_avatar], userController.uploadAvatar);
api.get("/get-avatar/:avatarName", userController.getAvatar);
api.put("/update-user/:id",[md_auth.ensureAuth], userController.updateUser);
api.put("/activate-user/:id", [md_auth.ensureAuth], userController.activateUser);
api.delete("/delete-user/:id",[md_auth.ensureAuth], userController.deleteUser);
api.post("/sign-up-admin/", [md_auth.ensureAuth], userController.signUpAdmin);

module.exports = api;