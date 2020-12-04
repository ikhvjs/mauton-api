module.exports = {
    isValidUsername:  function (username) {
        // const re = '^[a-zA-Z0-9]+$'; 
        const re = '^[a-zA-Z0-9]+$'; //only accept english and Numbers
        return username.match(re)&&username.length<=15;
    }

}