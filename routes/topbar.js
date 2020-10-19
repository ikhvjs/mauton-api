const db = require('../database')
const express = require('express');
const topbar = express.Router();

topbar.post('/', (req,res) => {
	// const {menu_name, menu_path, seq} = req.user;
	db.select('menu_name','seq','menu_path','menu_id')
	.from('tb_menu')
	.where({menu_level:1})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('error getting topbar menu')); 
});

// const handleTopbarGet = (req,res,db) => {
// 	db.select('menu_name','seq','menu_path','menu_id')
// 	.from('tb_menu')
// 	.where({menu_level:1})
// 	.then(menu=>res.json(menu))
// 	.catch(err => res.status(400).json('error getting topbar menu')); 
// }

module.exports = topbar;