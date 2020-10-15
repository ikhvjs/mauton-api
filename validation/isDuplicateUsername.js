const db = require('../database');

module.exports = {
    isDuplicateUsername: async function(username){
         return db.select('*')
                .from('tb_user')
                .where('user_name', '=', username)
                .then(user => {
                    return (user.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}