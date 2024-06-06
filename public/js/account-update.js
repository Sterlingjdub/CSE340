const form = document.querySelector("#updateAccount")
form.addEventListener("change", function () {
    const updateButton = document.querySelector('input[type="submit"]')
    updateButton.removeAttribute("disabled")
})