const express = require("express");
const NewsLetterController = require("../controllers/newsletter");

const api = express.Router();

api.post("/suscribe-email/:email", NewsLetterController.suscribeEmail);

module.exports = api;