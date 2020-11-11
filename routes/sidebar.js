const db = require('../database')
const express = require('express');
const sidebar = express.Router();
const {  INTERNAL_SERVER_ERROR_SIDEBAR_REQUEST
}  = require('../validation/validationConstants');

sidebar.post('/request', (req,res) => {
	const { topbarMenuID,userID } = req.body;
	db.orderBy('seq','asc')
	.select('menu_name',
			'menu_id')
	.from('tb_menu')
	.where({parent_menu_id:topbarMenuID,
			menu_level:2,
			user_id:userID})
	.then(result=>res.status(200).json(result))
	.catch(() => res.status(500).json(
		{Code:INTERNAL_SERVER_ERROR_SIDEBAR_REQUEST})
	);
});

// sidebar.get('/path/:topbarMenuPath', (req,res) => {
// 	const { topbarMenuPath } = req.params;

// 	db.select('tm1.menu_name','tm1.seq','tm1.menu_path','tm1.menu_id')
// 	.from('tb_menu as tm1')
// 	.join('tb_menu as tm2', function() {
// 	this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
// 	  .andOn('tm2.menu_level', '=', 1)
// 	  .andOn('tm1.menu_level', '=', 2)
// 	  .andOn('tm2.menu_path','=',db.raw('?',[topbarMenuPath]))
// 	})
// 	.then(menu=>res.json(menu))
// 	.catch(err => res.status(400).json('erro getting sidebar by path'));
// });

module.exports = sidebar;