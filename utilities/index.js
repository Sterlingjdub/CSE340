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
 * Build the Management view HTML
 * *************************************
Util.buildManagementView = async function () {
  let grid = '<div id="manageBtnsContainer">'
  grid += '<p class="management-p">Add a new vehicle classification by clicking on the button below</p>'
  grid += `<button id="manageClassificationBtn" class="manageBtn"
  onclick="location.href='./add-classification'">Add New Classification
</button>`
  grid += '<br><p class="management-p">Add a new vehicle to our inventory by clicking on the button below</p>'
  grid += `<button id="manageInventoryBtn" class="manageBtn"
  onclick="location.href='./add-inventory'">Add New Vehicle
</button>`
  grid += '</div>'
  return grid
}*/

/* **************************************
 * Build the add classification view HTML
 * *************************************/
/*Util.buildAddClassification = async function () {
  let grid = '<div class="center-container">'
  grid += '<div class="form-container">'
  grid += '<form action="/inv/add-classification" method="post">'
  grid += '<label for="classification_name" class="form-label">Classification Name:</label>'
  grid += '<p class="form-instructions">Name must be alphabetical characters only</p>'
  grid += '<input type="text" id="classification_name" name="classification_name" pattern="^[^\s!@#$%^&*]+$" required>'
  grid += '<input type="submit" id="add-classBtn" value="Add New Classification">'
  grid += '</form>'
  grid += '</div>'
  grid += '</div>'
  return grid
}/*

/* **************************************
 * Build the add inventory view HTML
 * *************************************/
/*Util.buildAddInventoryView = async function () {
  let grid = '<form id="addInvForm" action="/inv/add-inventory" method="post">'
  grid += '<fieldset id="enterInventory">'
  grid += '<p class="form-instructions">All fields are required*</p><br>'

  grid += '<label for="invMake" class="form-label">Make</label>'
  grid += `<input type="text" id="invMake" name="inv_make" 
  required value="<%= locals.inv_make%>">
<br><br>`
  grid += '<input type="text" id="classification_name" name="classification_name" pattern="^[^\s!@#$%^&*]+$" required>'
  grid += '<input type="submit" id="add-classBtn" value="Add New Classification">'
  grid += '</form>'
  grid += '</div>'
  grid += '</div>'
  return grid
}

<form id="addInvForm" action="/inv/add-inventory" method="post">
    <fieldset id="enterInventory">
      <p class="form-instructions">All fields are required*</p>
      <br>
  
      <label for="invMake" class="form-label">Make</label>
      <input type="text" id="invMake" name="inv_make" 
             required value="<%= locals.inv_make%>">
      <br><br>
      <label for="invModel" class="form-label">Model</label>
      <input type="text" id="invModel" name="inv_model" 
                 required value="<%= locals.inv_model%>">
      <br><br>
      <label for="invYear" class="form-label">Year</label>
      <input type="text" id="invYear" name="inv_year" 
             required pattern="^[0-9].{3,}$" 
             value="<%= locals.inv_year%>">
      <br><br>
      <label for="invDescription" class="form-label">Description</label>
      <textarea id="invDescription" name="inv_description" 
                required value="<%= locals.inv_description%>">
      </textarea>
      <br><br>
      <label for="invImg" class="form-label">Image Path</label>
      <input type="text" id="invImg" name="inv_image" 
             required value="<%= locals.inv_image ? locals.inv_image : '/images/vehicles/no-image.png' %>">
      <br><br>
      <label for="invThumb" class="form-label">Thumbnail Path</label>
      <input type="text" id="invThumb" name="inv_thumbnail" 
      required value="<%= locals.inv_thumbnail ? locals.inv_thumbnail : '/images/vehicles/no-image-tn.png' %>">

      <br><br>
      <label for="invPrice" class="form-label">Price</label>
      <input type="text" id="invPrice" name="inv_price" 
             required value=" <%= locals.inv_price%>">
      <br><br>
      <label for="invMiles" class="form-label">Miles</label>
      <input type="text" id="invMiles" name="inv_miles" 
             required value=" <%= locals.inv_miles%>">
      <br><br>
      <label for="classificationID" class="form-label">Classification ID</label>
      <%- categorySelect %>
      <br><br>
      <label for="invColor" class="form-label">Color</label>
      <input type="text" id="invColor" name="inv_color" 
            required value=" <%= locals.inv_color%>">


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

module.exports = Util