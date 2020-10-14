const db = require('../database')
const express = require('express');
const sidebar = express.Router();

sidebar.get('/id/:topbarMenuID', (req,res) => {
	const { topbarMenuID } = req.params;
	db.select('menu_name','seq','menu_path','menu_id')
	.from('tb_menu')
	.where({parent_menu_id:topbarMenuID, menu_level:2})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('erro getting sidebar by id'));
});

sidebar.get('/path/:topbarMenuPath', (req,res) => {
	const { topbarMenuPath } = req.params;

	db.select('tm1.menu_name','tm1.seq','tm1.menu_path','tm1.menu_id')
	.from('tb_menu as tm1')
	.join('tb_menu as tm2', function() {
	this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
	  .andOn('tm2.menu_level', '=', 1)
	  .andOn('tm1.menu_level', '=', 2)
	  .andOn('tm2.menu_path','=',db.raw('?',[topbarMenuPath]))
	})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('erro getting sidebar by path'));
});

// const handleSidebarGetByID = (req, res, db) => {
// 	const { topbarMenuID } = req.params;
// 	db.select('menu_name','seq','menu_path','menu_id')
// 	.from('tb_menu')
// 	.where({parent_menu_id:topbarMenuID, menu_level:2})
// 	.then(menu=>res.json(menu))
// 	.catch(err => res.status(400).json('erro getting sidebar by id'));
// }

// const handleSidebarGetByPath = (req, res, db) => {
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
// }



module.exports = sidebar;