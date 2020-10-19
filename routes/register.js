const db = require('../database')
const express = require('express');
const crypto = require('crypto');
const token = require('../token');
const { validateRegister } = require('../validation/validateRegister/validateRegister');
const { NO_ERROR, INTERNAL_SERVER_ERROR_REG_INSERT } = require('../validation/validationConstants');


const register = express.Router();

register.post('/', async (req,res) => {
	const { email, password, username, captchaToken } = req.body;
	const validationResult = await validateRegister(email,password,username,captchaToken);
	
	console.log('body',req.body);
	// console.log('validationResult',await validationResult);

	if (await validationResult.Code !== NO_ERROR){
		return res.status(400).send(validationResult);
	}

  	const hash = crypto.createHash('sha256').update(password).digest('hex');

  	db('tb_user')
	.returning('*')  
	.insert({
    	email: email.toLowerCase(),
	    password:hash,
	    user_name:username.toLowerCase(),
	    user_role:'user',
	    user_path:username.toLowerCase(),
	    created_date:new Date(),
	    created_by:username.toLowerCase(),
	    last_updated_date:new Date(),
	    last_updated_by:username.toLowerCase()
  	})
  	.then(user=>{
		// console.log('user',user[0]);
		res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        return res.json(token.createToken(user[0]));
	})
  	.catch( ()=>(res.status(400).send({ Code: INTERNAL_SERVER_ERROR_REG_INSERT
			, errMessage: 'Internal Server Error, please try again' }))
	);
    
});

module.exports = register