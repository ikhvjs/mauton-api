const db = require('../database')
const express = require('express');
const crypto = require('crypto');
const token = require('../token');

const login = express.Router();

login.post('/', (req,res) => {
    const { email, password, grant_type } = req.body;
    
    console.log('login bode',req.body);

	if (!grant_type || grant_type != 'password') {
        res.status(400).json({ error: 'unsupported_grant_type', error_description: 'Only support password grant type' });
        return;
    }

  	if (!email || !password ) {
    	return res.status(400).json('incorrect form submission');
  	}

  	const hash = crypto.createHash('sha256').update(password).digest('hex');

  	//check credentials
  	db.select('email').from('tb_user')
    .where('email', '=', email)
    .andWhere('password','=',hash)
    .then(data => {
        return db.select('*').from('tb_user')
          	.where('email', '=', email)
          	.then(user => user[0])
          	.catch(err => res.status(400).json('unable to get user'))
    })
    .then(user=>{
    	res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');
        res.json(token.createToken(user));
    })
    .catch(err => res.status(401).json({ error: 'invalid_client', error_description: 'Invalid email or password' }))
    // .catch(err => res.status(400).json(err))
    
});

module.exports = login