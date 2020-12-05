const db = require('../database')
const express = require('express');
const topbar = express.Router();
const { INTERNAL_SERVER_ERROR_TOPBAR_REQUEST
} = require('../validation/validationConstants');

topbar.post('/request', (req, res) => {
	const { userID } = req.user;
	db.orderBy('seq', 'asc')
		.select('menu_name',
			'seq',
			'menu_id')
		.from('tb_menu')
		.where({
			menu_level: 1,
			user_id: userID
		})
		.then(result => res.status(200).json(result))
		.catch(() => res.status(500).json(
			{ Code: INTERNAL_SERVER_ERROR_TOPBAR_REQUEST })
		);
});

module.exports = topbar;