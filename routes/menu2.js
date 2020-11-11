const db = require('../database')
const express = require('express');
const menu2 = express.Router();
const { validateCreateMenu2 } = require('../validation/validateMenu2/validateCreateMenu2');
const {  
	INTERNAL_SERVER_ERROR_MENU2_REQUEST,
	INTERNAL_SERVER_ERROR_MENU2_SEARCH,
	INTERNAL_SERVER_ERROR_MENU2_INSERT,
	INTERNAL_SERVER_ERROR_MENU2_DELETE,
	INTERNAL_SERVER_ERROR_MENU2_UPDATE
}  = require('../validation/validationConstants');

menu2.post('/request', (req,res) => {
	const {userID} = req.body;

	db.orderBy('tm1.menu_id','desc')
	.select('tm1.menu_id',
		'tm1.menu_name',
		'tm1.seq',
		'tm1.menu_path',
		'tm2.menu_name as parent_menu_name',
		'tm1.parent_menu_id')
	.from('tb_menu as tm1')
	.join('tb_menu as tm2', function() {
		this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
		.andOn('tm1.menu_level', '=',2)
		.andOn('tm1.user_id', '=',userID)
	})
	.then(menu=>res.status(200).json(menu))
	.catch(() => 
		res.status(500).json(
		{Code:INTERNAL_SERVER_ERROR_MENU2_REQUEST,
			errMessage:'Internal Server Error, please click Search button to try again'})
	);
});

menu2.post('/create', async (req,res) => {
	const {menu2Name,seq, menu2ParentMenuID,userID} = req.body;

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
	    seq:seq,
		parent_menu_id:menu2ParentMenuID,
		user_id:userID,
	    created_date:new Date(),
	    created_by:userID,
	    last_updated_date:new Date(),
	    last_updated_by:userID
  	})
  	.then(result => {
		res.status(200).json(`command:${result.command},rowCount:${result.rowCount}`);
	})
	.catch(() => (
		res.status(500).send({
			Code: INTERNAL_SERVER_ERROR_MENU2_INSERT,
			errMessage: 'Internal Server Error, please try again'
		})
	));
});
menu2.delete('/delete', (req,res) => {
	const {menu_id} = req.body;
	db('tb_menu')
	.where('menu_id', menu_id)
	.del()
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error delete menu2'));
});
menu2.post('/search', (req,res) => {
	const{menuName,parentMenuName,userID} = req.body;

	db.orderBy('tm1.menu_id','desc')
	.select('tm1.menu_id',
			'tm1.menu_name',
			'tm1.seq',
			'tm2.menu_name as parent_menu_name',
			'tm1.parent_menu_id')
	.from('tb_menu as tm1')
	.join('tb_menu as tm2', function() {
		this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
		.andOn('tm1.menu_level', '=',2)
		.andOn('tm1.menu_name','~*',db.raw('?',[menuName]))
		.andOn('tm2.menu_name','~*',db.raw('?',[parentMenuName]))
		.andOn('tm1.user_id','=',userID)
	})
	.then(menu=>res.status(200).json(menu))
	.catch( ()=> (
			res.status(500).send({ 
				Code: INTERNAL_SERVER_ERROR_MENU2_SEARCH,
				errMessage: 'Internal Server Error, please try again' 
			})
		)
	);
});
menu2.put('/update', (req,res) => {
	const{menu_id,menu_name,menu_path,seq, parent_menu_id} = req.body;
	db('tb_menu')
	.where('menu_id', '=', menu_id)
	.update({
		menu_name: menu_name,
		menu_path: menu_path,
		seq:seq,
		parent_menu_id:parent_menu_id, 
		last_updated_date:new Date(),
		last_updated_by:'testingUser1'
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error update menu2'))
});

module.exports = menu2;

// const handleMenu2Get =(req,res,db) =>{

// 	db.orderBy('tm1.menu_id','desc')
// 	.select('tm1.menu_id',
// 		'tm1.menu_name',
// 		'tm1.seq',
// 		'tm1.menu_path',
// 		'tm2.menu_name as parent_menu_name',
// 		'tm1.parent_menu_id')
// 	.from('tb_menu as tm1')
// 	.join('tb_menu as tm2', function() {
// 		this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
// 		.andOn('tm1.menu_level', '=',2)
// 	})
// 	.then(menu=>res.json(menu))
// 	.catch(err => res.status(400).json('err in getting menu2')); 
// }


// const handleMenu2Post =(req,res,db)=>{
//   const {menu_name, menu_path, seq, parent_menu_id} = req.body;
//   db('tb_menu')
//   .insert({
//   	menu_level: 2,
//     menu_name: menu_name,
//     menu_path: menu_path,
//     seq:seq,
//     parent_menu_id:parent_menu_id,
//     created_date:new Date(),
//     created_by:'testingUser1',
//     last_updated_date:new Date(),
//     last_updated_by:'testingUser1'
//   })
//   .then(data=>res.json(data))
//   .catch(err => res.status(400).json(err));
// }

// const handleMenu2Delete=(req,res,db)=>{
// 	const {menu_id} = req.body;
// 	db('tb_menu')
// 	.where('menu_id', menu_id)
// 	.del()
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error delete menu2'));
// }

// const handleMenu2Search=(req,res,db)=>{
// 	const{menu_name,menu_path,parent_menu_name} = req.body;

// 	db.orderBy('tm1.menu_id','desc')
// 	.select('tm1.menu_id',
// 			'tm1.menu_name',
// 			'tm1.menu_path',
// 			'tm1.seq',
// 			'tm2.menu_name as parent_menu_name',
// 			'tm1.parent_menu_id')
// 	.from('tb_menu as tm1')
// 	.join('tb_menu as tm2', function() {
// 		this.on('tm1.parent_menu_id', '=', 'tm2.menu_id')
// 		.andOn('tm1.menu_level', '=',2)
// 		.andOn('tm1.menu_name','~*',db.raw('?',[menu_name]))
// 		.andOn('tm1.menu_path','~*',db.raw('?',[menu_path]))
// 		.andOn('tm2.menu_name','~*',db.raw('?',[parent_menu_name]))
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json(err));
// }

// const handleMenu2Update=(req,res,db)=>{
// 	const{menu_id,menu_name,menu_path,seq, parent_menu_id} = req.body;
// 	db('tb_menu')
// 	.where('menu_id', '=', menu_id)
// 	.update({
// 		menu_name: menu_name,
// 		menu_path: menu_path,
// 		seq:seq,
// 		parent_menu_id:parent_menu_id, 
// 		last_updated_date:new Date(),
// 		last_updated_by:'testingUser1'
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error update menu2'))
// }


// module.exports = {
//   handleMenu2Get,
//   handleMenu2Post,
//   handleMenu2Delete,
//   handleMenu2Search,
//   handleMenu2Update
// }
