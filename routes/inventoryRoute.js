// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details by detail view
router.get("/detail/:detailId", utilities.handleErrors(invController.buildByDetailId));

// Route to build error 500 by error view
router.get("/error/", utilities.handleErrors(invController.buildError));

module.exports = router;