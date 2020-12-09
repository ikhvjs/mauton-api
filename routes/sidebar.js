const db = require('../database')
const express = require('express');
const sidebar = express.Router();
const { INTERNAL_SERVER_ERROR_SIDEBAR_REQUEST
} = require('../validation/validationConstants');

sidebar.post('/request', (req, res) => {
	const { topbarMenuID } = req.body;
	const { userID } = req.user;
	db.orderBy('seq', 'asc')
		.select('menu_name',
			'menu_id')
		.from('tb_menu')
		.where({
			parent_menu_id: topbarMenuID,
			menu_level: 2,
			user_id: userID
		})
		.then(result => res.status(200).json(result))
		.catch((err) => {
			console.log(err);
			res.status(500).json(
				{ Code: INTERNAL_SERVER_ERROR_SIDEBAR_REQUEST })
		});
});

module.exports = sidebar;