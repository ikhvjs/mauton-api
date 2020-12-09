const db = require('../database')
const express = require('express');
const menu2 = express.Router();
const { validateCreateMenu2 } = require('../validation/validateMenu2/validateCreateMenu2');
const { validateDeleteMenu2 } = require('../validation/validateMenu2/validateDeleteMenu2');
const { validateUpdateMenu2 } = require('../validation/validateMenu2/validateUpdateMenu2');
const {
	INTERNAL_SERVER_ERROR_MENU2_REQUEST,
	INTERNAL_SERVER_ERROR_MENU2_SEARCH,
	INTERNAL_SERVER_ERROR_MENU2_INSERT,
	INTERNAL_SERVER_ERROR_MENU2_DELETE,
	INTERNAL_SERVER_ERROR_MENU2_UPDATE
} = require('../validation/validationConstants');

menu2.post('/request', (req, res) => {
	const { userID } = req.user;

	db.orderBy('tm1.menu_id', 'desc')
		.select('tm1.menu_id',
			'tm1.menu_name',
			'tm1.seq',
			'tm1.menu_path',
			'tm2.menu_name as parent_menu_name',
			'tm1.parent_menu_id')
		.from('tb_menu as tm1')
		.join('tb_menu as tm2', function () {
			this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
				.andOn('tm1.menu_level', '=', 2)
				.andOn('tm1.user_id', '=', userID)
		})
		.then(menu => res.status(200).json(menu))
		.catch((err) => {
			console.log(err);
			res.status(500).json(
				{
					Code: INTERNAL_SERVER_ERROR_MENU2_REQUEST,
					errMessage: 'Internal Server Error, please click Search button to try again'
				});
		});
});

menu2.post('/create', async (req, res) => {
	const { menu2Name, seq, menu2ParentMenuID } = req.body;
	const { userID } = req.user;
	const validationResult = await validateCreateMenu2(menu2Name, seq, menu2ParentMenuID, userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_menu')
		.insert({
			menu_level: 2,
			menu_name: menu2Name,
			seq: seq,
			parent_menu_id: menu2ParentMenuID,
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
				Code: INTERNAL_SERVER_ERROR_MENU2_INSERT,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});
menu2.delete('/delete', async (req, res) => {
	const { menu2ID } = req.body;
	const { userID } = req.user;
	const validationResult = await validateDeleteMenu2(menu2ID, userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}

	db('tb_menu')
		.where('menu_id', menu2ID)
		.andWhere('user_id', userID)
		.del()
		.then(data => res.status(200).json(data))
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU2_DELETE,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});
menu2.post('/search', (req, res) => {
	const { menuName, parentMenuName } = req.body;
	const { userID } = req.user;
	db.orderBy('tm1.menu_id', 'desc')
		.select('tm1.menu_id',
			'tm1.menu_name',
			'tm1.seq',
			'tm2.menu_name as parent_menu_name',
			'tm1.parent_menu_id')
		.from('tb_menu as tm1')
		.join('tb_menu as tm2', function () {
			this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
				.andOn('tm1.menu_level', '=', 2)
				.andOn('tm1.menu_name', '~*', db.raw('?', [menuName]))
				.andOn('tm2.menu_name', '~*', db.raw('?', [parentMenuName]))
				.andOn('tm1.user_id', '=', userID)
		})
		.then(menu => res.status(200).json(menu))
		.catch(() => (
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU2_SEARCH,
				errMessage: 'Internal Server Error, please try again'
			})
		)
		);
});
menu2.put('/update', async (req, res) => {
	const { menu2ID, menu2Name, menu2ParentMenuID, seq } = req.body;
	const { userID } = req.user;
	const validationResult = await validateUpdateMenu2(menu2ID,
		menu2Name,
		menu2ParentMenuID,
		seq,
		userID);

	if (await validationResult.Status !== 200) {
		return res.status(validationResult.Status).send({
			Code: validationResult.Code,
			errMessage: validationResult.errMessage
		});
	}
	db('tb_menu')
		.where('menu_id', '=', menu2ID)
		.andWhere('user_id', '=', userID)
		.update({
			menu_name: menu2Name,
			seq: seq,
			parent_menu_id: menu2ParentMenuID,
			last_updated_date: new Date(),
			last_updated_by: userID
		})
		.then(result => {
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU2_UPDATE,
				errMessage: 'Internal Server Error, please try again'
			});
		});
});

module.exports = menu2;