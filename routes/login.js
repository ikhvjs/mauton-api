
const express = require('express');
const db = require('../database');
const crypto = require('crypto');
const token = require('../token');
const { NO_ERROR,
    INTERNAL_SERVER_ERROR_SIGNIN_SELECT,
    SIGNIN_INVALID_CLIENT
} = require('../validation/validationConstants');
const { validateLogin } = require('../validation/validateLogin/validateLogin');

const login = express.Router();

login.post('/', async (req, res) => {
    const { email, password, grant_type, captchaToken } = req.body;
    const validationResult = await validateLogin(email, password, grant_type, captchaToken);

    if (await validationResult.Code !== NO_ERROR) {
        return res.status(400).send(validationResult);
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    //check credentials
    await db.select('*')
        .from('tb_user')
        .where('email', '=', email)
        .andWhere('password', '=', hash)
        .then((user) => {
            if (user.length === 0) {
                return res.status(400).send({ Code: SIGNIN_INVALID_CLIENT, errMessage: 'Invalid Email or Password' })
            }
            res.set({
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            })
            return res.status(200).json(token.createToken(user[0]))
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                Code: INTERNAL_SERVER_ERROR_SIGNIN_SELECT,
                errMessage: 'Internal Server Error, please try again'
            });
        })

});

module.exports = login