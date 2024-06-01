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

// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to build get inventory view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to get edit inventory view
router.get("/edit/:detailId", utilities.handleErrors(invController.editInventoryView));

// POST Routes
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData, utilities.handleErrors(invController.registerClassification) )

router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventoryItem) )

router.post("/update/", invValidate.inventoryRules(),
  invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));



module.exports = router;