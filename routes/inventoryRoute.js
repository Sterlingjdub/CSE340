// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
const acctValidate = require("../utilities/account-validation")

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

// Route to build get edit inventory view
router.get("/edit/:detailId", utilities.handleErrors(invController.editInventoryView));

// Route to build delete inventory view
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInventory));

// Post to the inventory management view
router.post("/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildVehicleManagement));

// Post to the add classification view
router.post("/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.registerClassification))

// Post to the add inventory view
router.post("/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventoryItem))

// Post to the update inventory view
router.post("/update/",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory));

// Post to the delete inventory view
router.post("/delete/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory));

module.exports = router;