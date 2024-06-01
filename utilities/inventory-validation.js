const Util = require (".");
  const { body, validationResult } = require("express-validator");
  const inventoryModel = require("../models/inventory-model");
  const validate = {}

 /* **********************************
  *  Add New Classificaiton Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // valid classification name is required and cannot already exist in the DB
      body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("A valid classification name is required.")
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please try another.")
        }

      })

    ]
  }

  /* ******************************
 * Check data and return errors for the Add Classificaion View
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Manage Classifications",
      nav,
      classification_name,
    })
    return
  }
  next()
}

  /*  **********************************
  *  Add Inventory Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
      // vehicle make is required and must be a string
      body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle make."),

      // vehicle model is required and must be a string
      body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle make."),

      // vehicle year is required and must be in xxxx format
      body("inv_year")
      .trim()
      .escape()
      .isNumeric()
      .isLength({ min:4, max: 4 }),

      // vehicle descritption is required 
      body("inv_description")
      .trim()
      .escape()
      .isLength({ min:1 })
      .withMessage("Please provide a description of the  vehicle."),

      // vehicle image is required
      body("inv_image")
      .trim()
      .escape()
      .isLength({ min:1 })
      .withMessage("Please provide the path to the vehicle image."),

      // vehicle thumbnail is required
      body("inv_thumbnail")
      .trim()
      .escape()
      .isLength({ min:1 })
      .withMessage("Please provide the path to the vehicle thumbnail."),

      // vehicle price is required and must be a number only
      body("inv_price")
      .trim()
      .escape()
      .isNumeric()
      .isLength({ min:1 })
      .withMessage("Please provide the price."),
      
      // vehicle miles is required and must be a number only
      body("inv_miles")
      .trim()
      .escape()
      .isNumeric()
      .isLength({ min:1 })
      .withMessage("Please provide the miles."),

      // vehicle color is required
      body("inv_color")
      .trim()
      .escape()
      .isLength({ min:1 })
      .withMessage("Please provide the color."),

      // classification ID is required and must be a number only
      body("classification_id")
      .trim()
      .escape()
      .isNumeric()
      .isLength({ min:1 })
      .withMessage("Please provide the classification.")

    ]
  }

/* ******************************
 * Check data and return errors for the Add
 * Inventory View
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year,inv_description, 
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
  classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    let categorySelect = await Util.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Manage Inventory",
      nav,
      categorySelect,
      inv_make, 
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color, 
      classification_id,
    })
    console.log(`this is were it is ${JSON.stringify(errors)}`)
    return
  }
  next()
}

/* ******************************
 * Check data and return errors for the Edit
 * Inventory View
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year,inv_description, 
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
  classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    let categorySelect = await Util.buildClassificationList();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      categorySelect,
      inv_id,
      inv_make, 
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color, 
      classification_id,
    })
    return
  }
  next()
}

module.exports = validate