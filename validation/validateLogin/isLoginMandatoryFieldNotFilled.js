module.exports = {
    isLoginMandatoryFieldNotFilled:  function (email, password) {
        return (!email || !password)
    }

}