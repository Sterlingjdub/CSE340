const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +
        '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model +
        'details"><img src="' + vehicle.inv_thumbnail +
        '" alt="'+vehicle.inv_color +' ' + vehicle.inv_make + ' ' + vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' +
        vehicle.inv_make + ' ' + vehicle.inv_model + ' details" class="vehicle-link">' +
        vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}  

  /* **************************************
* Build the inventory Detail view HTML
* ************************************ */
Util.buildVehicleView = async function(data){
  let grid
  if(data.length > 0){
    const vehicle = data[0]
    grid = '<div id="vehicle-display">'
      grid += '<a  href="#" title="CSE Motors ' + vehicle.inv_make + ' ' + vehicle.inv_model +'">'
      grid += '<img id="vehicle-image" src="' + vehicle.inv_image +'" alt="'+vehicle.inv_color +' '+ vehicle.inv_make + ' ' + vehicle.inv_model +' "> </a>'
      grid += '<div class="details">'
      grid += '<h2> '
      grid += vehicle.inv_make + ' ' + vehicle.inv_model + ' Details '
      grid += '</h2>'
      grid += '<p class="price-color"> <span><strong>Price: </strong></span>' + ' $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>' 
      grid += '<p> <span><strong>Description: </strong></span>' + vehicle.inv_description + ' </p>'
      grid += '<p> <span><strong>Color: </strong></span>' + vehicle.inv_color + ' </p>'
      grid += '<p> <span><strong>Miles: </strong></span>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +' </p>'
      grid += '</div>'
    
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
* Build error view HTML
* ************************************ */
Util.buildErrorMessage = async function(){
  let error500
    error500 = '<div id="details-display-error">'
    error500 += '<p>Oh no! There was a crash. Maybe try a different route?</p>'
    error500 += '</div>'
  return error500
}

 /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util