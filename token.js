const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyToken (req, res, next) {
	// if no JWT
	// console.debug('in verifyToken header auth',req.headers.authorization);
    if (!req.headers.authorization) {
        res.customStatus = 401;
        res.customError = { error: 'invalid_client', error_description: 'no token' };
    }

    if (req.headers.authorization 
    	&& req.headers.authorization.split(' ')[0] == 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], config.secret,
        	function (err, decoded) {
				console.debug('in decode');
	            if (err) {
	                res.customStatus = 400;
	                switch (err.name) {
	                    // JWT expired
	                    case 'TokenExpiredError':
	                        res.customError = { error: 'invalid_grant', error_description: 'token expired' };
	                        break;
	                    // JWT invalid
	                    case 'JsonWebTokenError':
	                        res.customError = { error: 'invalid_grant', error_description: 'token invalid' };
	                        break;
	                }
	            } else {
	            	console.log('decoded',decoded);
	                req.user = decoded;                    
	            }
        	});
    }

    if (res.customError) {
        res.status(res.customStatus).json(res.customError);
        return;
    }

    next();
}

function createToken(user){
	let payload = {
            iss: user.user_id,
            sub: 'Mauton Web API',
            role: user.user_role
    };

    //create JWT
    let token = jwt.sign(
    	payload, 
    	config.secret, 
    	{
	        algorithm: 'HS256',
	        expiresIn: config.tokenExpiredTime + 's'  // JWT expired time = Current time + increased time (set to seconds, Default ms)
    	}
    )
    
    // JSON format in OAuth 2.0 standard
    return ({
        access_token: token,
        token_type: 'bearer',
        expires_in: (Date.parse(new Date()) / 1000) + config.tokenExpiredTime, 
        scope: user.user_role,
        info: {
            userID: user.user_id
    	}
	});
}

module.exports = {
	createToken,
	verifyToken
}