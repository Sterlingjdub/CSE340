const utilities = require("../utilities/");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver logout view
 * *************************************** */
const buildLogout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.redirect("/")
  } catch (error) {
    error.status = 500;
    error.message = "SERVER ERROR"
    next(error);
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", `Sorry, there was an error processing the registration.`)
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, the registration failed.`)
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* *******************************
 * Build account management
 ****************************** */
const buildAccountManagement = async (req, res, next) => {
  try {

    let nav = await utilities.getNav();
    const acctId = res.locals.accountData.account_id;
    const welcomeBasic = res.locals.accountData.account_firstname;
    let grid = "";

    res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      welcomeBasic,
      acctId,
      grid
    })

  } catch (error) {
    console.error(error);
    error.status = 500;
    error.message = "SERVER ERROR"
    next(error);
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const {
    account_email,
    account_password
  } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", `Please check your credentials and try again.`)
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600
      })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000
        })
      }
      return res.redirect("/account/")
    } else {
      req.flash("notice", `Please check your credentials and try again.`)
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* *******************************
 * Build update information view
 ****************************** */
async function buildUpdateInfo(req, res, next) {
  const account_id = parseInt(req.params.acctId);
  try {
    let nav = await utilities.getNav();
    const accountInfo = await accountModel.getAccountById(account_id);

    res.render("account/update-information", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id,
      welcomeBasic: accountInfo.account_firstname,
      account_firstname: accountInfo.account_firstname,
      account_lastname: accountInfo.account_lastname,
      account_email: accountInfo.account_email
    })
  } catch (errors) {
    req.flash("notice", errors)
  }
}

/* *******************************
 * Build update information
 ****************************** */
async function updateInfo(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body

  const updateResult = await accountModel.updateInformation(
    account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    const accountName = updateResult.account_firstname + " " +
      updateResult.account_lastname;
    req.flash("notice", `The information for ${accountName} was successfully updated.`)
    res.redirect("/account/")
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-information", {
      title: "Edit information for " + accountName,
      nav,
      errors: null,
      welcomeBasic: account_firstname,
      account_firstname,
      account_lastname,
      account_email,
      account_id

    })
  }
}

/* ****************************************
 *  Process password change request
 * ************************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id
  } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/update-information", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)


  if (updateResult) {
    const accountName = `${updateResult.account_firstname} 
      ${updateResult.account_lastname}`;
    req.flash("notice", `The password for ${accountName} was successfully updated.`)
    res.status(202).render("account/account-management", {
      title: "Edit Information for " + accountName,
      nav,
      errors: null,
      welcomeBasic: account_firstname,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      acctId: account_id,
    })

  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the password update failed.")
    res.render("account/update-information/", {
      title: "Edit Info for " + accountName,
      nav,
      errors: null,
      welcomeBasic: account_firstname,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
}

module.exports = {
  buildLogin,
  buildLogout,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  accountLogin,
  buildUpdateInfo,
  updateInfo,
  updatePassword
};