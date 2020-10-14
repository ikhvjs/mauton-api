const db = require('../database')
const express = require('express');
const crypto = require('crypto');
const token = require('../token');

const register = express.Router();

register.post('/', (req,res) => {
	const { email, password, username } = req.body;

	console.log('body',req.body);

  	if (!email || !password || !username) {
    	return res.status(400).json('incorrect form submission');
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
		//   console.log('user',user[0]);
		res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.json(token.createToken(user[0]));
	})
  	.catch(err => res.status(400).json(err));
    
});

module.exports = register