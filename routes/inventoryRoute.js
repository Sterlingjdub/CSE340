// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details by detail view
router.get("/detail/:detailId", utilities.handleErrors(invController.buildByDetailId));

// Route to build error 500 by error view
router.get("/error/", utilities.handleErrors(invController.buildError));

router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// POST Routes
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData, utilities.handleErrors(invController.buildAddClassification) )

  router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventoryItem) )


module.exports = router;