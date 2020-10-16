module.exports = {
    isValidUsername:  function (username) {
        // const re = '^[a-zA-Z0-9]+$'; 
        const re = '^[a-z0-9]+$'; //only accept lower capital english and Numbers
        return username.match(re);
    }

}