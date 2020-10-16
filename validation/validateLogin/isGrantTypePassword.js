module.exports = {
    isGrantTypeNotPassword:  function (grant_type) {
        return (!grant_type || grant_type != 'password')
    }

}