const { captchaSecret } = require('../../config');
const fetch = require('node-fetch');

module.exports = {
    isValidLoginCaptchaToken:  async function (captchaToken) {
        return fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${captchaSecret}&response=${captchaToken}`,
        })
        .then(response => response.json())
        .then(data => {
            return data.success; //true or false
        })
        .catch(err => {
            return err.message;
        });
    }

}