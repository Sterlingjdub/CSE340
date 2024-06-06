// Needed Resources 
const utilities = require(".")
const {
    body,
    validationResult
} = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .isLength({
            min: 1
        })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .escape()
        .isLength({
            min: 2
        })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists) {
                throw new Error("Email exists. Please log in or use different email")
            }
        }),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const {
        account_firstname,
        account_lastname,
        account_email
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Invalid password"),
    ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const {
        account_email
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Update information rules
 * ********************************* */
validate.UpdateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({
            min: 1
        })
        .withMessage("Please provide a first name."),

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({
            min: 2
        })
        .withMessage("Please provide a last name."),

        // valid email is required
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
    ]
}

/*  **********************************
 *  Check data and return errors or continue to update information
 * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await Util.getNav()
        res.render("account/update-information", {
            errors,
            title: "Account Update",
            nav,
            welcomeBasic: account_firstname,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

/* ******************************
 * Update Password Rules
 * ***************************** */
validate.updatePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check account type
 * ***************************** */
validate.checkPasswordUpdate = async (req, res, next) => {
    const accountId = req.params.accountId;
    const {
        account_password
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update-information", {
            errors,
            title: "Edit Information",
            nav,
            account_id: accountId,
            accountId,
            welcomeBasic: ""
        })
        return errors
    }
    next()
}

/* ******************************
 * Check account type
 * ***************************** */
validate.checkAccountType = (req, res, next) => {
    if (res.locals.loggedin && (res.locals.accountData.account_type === "Employee" ||
            res.locals.accountData.account_type === "Admin")) {
        next();
    } else {
        req.flash("notice", "Access denied");
        return res.redirect("account/login");
    }
}

module.exports = validate