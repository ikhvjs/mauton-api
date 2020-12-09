const db = require('../database')
const express = require('express');
const { validateCreateMenu1 } = require('../validation/validateMenu1/validateCreateMenu1');
const { validateDeleteMenu1 } = require('../validation/validateMenu1/validateDeleteMenu1');
const { validateUpdateMenu1 } = require('../validation/validateMenu1/validateUpdateMenu1');
const menu1 = express.Router();
const {
	INTERNAL_SERVER_ERROR_MENU1_REQUEST,
	INTERNAL_SERVER_ERROR_MENU1_SEARCH,
	INTERNAL_SERVER_ERROR_MENU1_INSERT,
	INTERNAL_SERVER_ERROR_MENU1_DELETE,
	INTERNAL_SERVER_ERROR_MENU1_UPDATE
} = require('../validation/validationConstants');

menu1.post('/request', (req, res) => {
	const { userID } = req.user;
	db.orderBy('menu_id', 'desc')
		.select('menu_name', 'seq', 'menu_id')
		.from('tb_menu')
		.where({
			menu_level: 1,
			user_id: userID
		})
		.then(menu => res.status(200).json(menu))
		.catch((err) => {
			console.log(err);
			res.status(500).json(
				{
					Code: INTERNAL_SERVER_ERROR_MENU1_REQUEST,
					errMessage: 'Internal Server Error, please click Search button to try again'
				});
		});
});
menu1.post('/create', async (req, res) => {
	const { menu1Name, seq } = req.body;
	const { userID } = req.user;

	const validationResult = await validateCreateMenu1(menu1Name, seq, userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_menu')
		.insert({
			menu_level: 1,
			menu_name: menu1Name,
			seq: seq,
			user_id: userID,
			created_date: new Date(),
			created_by: userID,
			last_updated_date: new Date(),
			last_updated_by: userID
		})
		.then(result => {
			res.status(200).json(`command:${result.command},rowCount:${result.rowCount}`);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU1_INSERT,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});
menu1.delete('/delete', async (req, res) => {
	const { menu1ID } = req.body;
	const { userID } = req.user;

	const validationResult = await validateDeleteMenu1(menu1ID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_menu')
		.where('menu_id', menu1ID)
		.andWhere('user_id', userID)
		.del()
		.then(data => res.status(200).json(data))
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU1_DELETE,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});
menu1.post('/search', (req, res) => {
	const { menuName } = req.body;
	const { userID } = req.user;

	db.orderBy('menu_id', 'desc')
		.select('menu_id', 'menu_name', 'seq')
		.from('tb_menu')
		.where('menu_name', '~*', menuName)
		.andWhere('menu_level', '=', 1)
		.andWhere('user_id', '=', userID)
		.then(menu => res.status(200).json(menu))
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU1_SEARCH,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});
menu1.put('/update', async (req, res) => {
	const { menu1ID, menu1Name, seq } = req.body;
	const { userID } = req.user;

	const validationResult = await validateUpdateMenu1(menu1ID, menu1Name, seq, userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}
	db('tb_menu')
		.where('menu_id', '=', menu1ID)
		.andWhere('user_id', '=', userID)
		.update({
			menu_name: menu1Name,
			seq: seq,
			user_id: userID,
			last_updated_date: new Date(),
			last_updated_by: userID
		})
		.then(result => {
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU1_UPDATE,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});

module.exports = menu1;