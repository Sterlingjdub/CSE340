const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* *******************************
 * Build inventory by classification view
 ****************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })

  } catch (error) {
    error.status = 500;
    error.message = "This category is not available at the moment. Please try again later"
    next(error);
  }
}

/* ***************************
 *  Build details by vehicle view
 * ************************** */
invCont.buildByDetailId = async function (req, res, next) {
  try {
    const detail_id = req.params.detailId
    const data = await invModel.getVehicleByDetailId(detail_id)
    const grid = await utilities.buildVehicleView(data)
    let nav = await utilities.getNav()
    const vehicleTitle = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model

    res.render("./inventory/detail", {
      title: vehicleTitle,
      nav,
      grid,
      errors: null,
    })


  } catch (error) {
    error.status = 500;
    error.message = "This vehicle's information is not available at the moment. Please try again later"
    next(error);
  }
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  
    } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
    }
}

/* ***************************
 *  Build the add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Manage Classifications",
      nav,
      errors: null,
    })
  
    } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
    }
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const invResult = await invModel.registerClassification(
    classification_name
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${classification_name} classification.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, something whent wrong!.")
    res.status(501).render("inventory/add-classification", {
      title: "Manage Classifications",
      nav,
      errors: null,
    })
  }
}

/* ***************************
*  Build the add inventory view
* ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
      let categorySelect = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Manage Inventory",
      nav,
      categorySelect,
      errors: null,
    })
  
    } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
    }
  }

  /* ****************************************
*  Process New Inventory Item
* *************************************** */
invCont.registerInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body

  const invResult = await invModel.registerInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${inv_make + ' ' + inv_model}.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, something whent wrong!.")
    res.status(501).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  }
}


/* ***************************
 *  Build the error view
 * ************************** */
invCont.buildError = function (req, res, next) {
  const error500 = new Error();
  error500.status = 500;
  error500.message = "This is not the vehicle you are looking for";
  next(error500)
}

module.exports = invCont