const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +
        '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model +
        'details"><img src="' + vehicle.inv_thumbnail +
        '" alt="' + vehicle.inv_color + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model +
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
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += 'value=" <%= locals.inv_miles%>'
  classificationList += "</select>"
  return classificationList
}

/* **************************************
 * Build the inventory Detail view HTML
 * ************************************ */
Util.buildVehicleView = async function (data) {
  let grid
  if (data.length > 0) {
    const vehicle = data[0]
    grid = '<div id="vehicle-display">'
    grid += '<a  href="#" title="CSE Motors ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    grid += '<img id="vehicle-image" src="' + vehicle.inv_image + '" alt="' + vehicle.inv_color + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' "> </a>'
    grid += '<div class="details">'
    grid += '<h2> '
    grid += vehicle.inv_make + ' ' + vehicle.inv_model + ' Details '
    grid += '</h2>'
    grid += '<p class="price-color"><strong>Price: </strong>' + ' $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    grid += '<p><strong>Description: </strong>' + vehicle.inv_description + ' </p>'
    grid += '<p><strong>Color: </strong>' + vehicle.inv_color + ' </p>'
    grid += '<p><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' </p>'
    grid += '</div>'

    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build a dynamic drop-down select list
 * ************************************ */
Util.selectList = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<label class="lbl-properties">Classification: '
  list += '<select class="lbl-properties" id="classification_id" name="classification_id" required>'
  list += '<option value="">Choose a classification</option>'
  data.rows.forEach((row) => {
    list += '<option value="' + row.classification_id
    list += '">' + row.classification_name + '</option>'
  })
  list += '</select>'
  list += '</label>'
  return list
}

/* **************************************
 * Build error view HTML
 * ************************************ */
Util.buildErrorMessage = async function () {
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


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ******************************
 * Check account type
 * ***************************** */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === "Employee" ||
          res.locals.accountData.account_type === "Admin")) {
      next();
  } else {
      req.flash("notice", "Access denied");
      return res.redirect("account/login");
  }
}

module.exports = Util