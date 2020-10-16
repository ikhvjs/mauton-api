module.exports = {
    isValidPassword:  function (password) {
    // at least one number, one lowercase and one uppercase letter
    // at least 8 characters
        const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return re.test(password);
    }

}