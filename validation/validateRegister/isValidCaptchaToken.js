const { captchaSecret } = require('../../config');

module.exports = {
    isValidCaptchaToken:  async function (captchaToken) {
        const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
        
        return fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${captchaSecret}&response=${captchaToken}`,
        })
        .then(response => response.json())
        .then(data => {
            return data.success; //true or false
        });
    }

}