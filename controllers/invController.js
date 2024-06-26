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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect
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
  const {
    classification_name
  } = req.body

  const invResult = await invModel.setInventoryClassification(
    classification_name
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added the: ${classification_name} classification.`
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
  const {
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
  } = req.body

  const invResult = await invModel.setInventoryItem(
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
  const classificationSelect = await utilities.buildClassificationList();
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${inv_make + ' ' + inv_model} to the inventory.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect
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
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.detailId);
  try {
    let nav = await utilities.getNav();
    const result = await invModel.getVehicleByDetailId(inv_id)
    const invData = result[0];
    let categorySelect = await utilities.buildClassificationList(invData.classification_id)
    const itemName = invData.inv_make + " " + invData.inv_model;

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      categorySelect: categorySelect,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
      inv_description: invData.inv_description,
      inv_image: invData.inv_image,
      inv_thumbnail: invData.inv_thumbnail,
      inv_price: invData.inv_price,
      inv_miles: invData.inv_miles,
      inv_color: invData.inv_color,
      classification_id: invData.classification_id
    })
  } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
  }
}

/* ****************************************
 *  Update Inventory Item
 * *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `The ${itemName} was successfully updated.`
    )
    res.redirect("/inv/")
  } else {
    const categorySelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      categorySelect: categorySelect,
      errors: null,
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
      classification_id
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId);
  try {
    let nav = await utilities.getNav();
    const result = await invModel.getVehicleByDetailId(inv_id)
    const invData = result[0]
    const itemName = `${invData.inv_make} ${invData.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
      inv_price: invData.inv_price,
    })
  } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
  }
}

/* ****************************************
 *  Delete Inventory Item
 * *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const deleteResult = await invModel.deleteInventoryItem(
    inv_id
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash(
      "notice",
      `The vehicle was successfully deleted.`
    )
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete Item",
      nav,
      categorySelect: categorySelect,
      errors: null,
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
      classification_id
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