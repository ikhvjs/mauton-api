module.exports = {
    isMandatoryFieldNotFilled:  function (email, password, username) {
        return (!email || !password || !username)
    }

}