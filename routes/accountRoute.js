// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Logout route
router.get("/logout", utilities.handleErrors(accountController.buildLogout))

// Logged in route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Update information route
router.get("/update-information/:acctId", utilities.handleErrors(accountController.buildUpdateInfo))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the update information request
router.post(
  "/update-information",
  regValidate.UpdateRules(), 
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateInfo)
)

// Process the password change request
router.post("/update-password",
  regValidate.updatePasswordRules(), 
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.updatePassword));

module.exports = router;