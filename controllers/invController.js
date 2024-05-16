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
  })


} catch (error) {
  error.status = 500;
  error.message = "This vehicle's information is not available at the moment. Please try again later"
  next(error);
}}

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