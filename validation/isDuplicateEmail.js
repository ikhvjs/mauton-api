const db = require('../database');

module.exports = {
    isDuplicateEmail: async function(email){
         return db.select('*')
                .from('tb_user')
                .where('email', '=', email)
                .then(user => {
                    return (user.length > 0)?true:false
                })
                .catch(err => {
                    return err.message;
                });
    }

}