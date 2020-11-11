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
	const { userID } = req.body;
	db.orderBy('menu_id', 'desc')
		.select('menu_name', 'seq', 'menu_id')
		.from('tb_menu')
		.where({
			menu_level: 1,
			user_id: userID
		})
		.then(menu => res.status(200).json(menu))
		.catch(() => res.status(500).json(
			{
				Code: INTERNAL_SERVER_ERROR_MENU1_REQUEST,
				errMessage: 'Internal Server Error, please click Search button to try again'
			})
		);
});
menu1.post('/create', async (req, res) => {
	const { menu1Name, seq, userID } = req.body;

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
		.catch(() => (
			res.status(500).send({
				Code: INTERNAL_SERVER_ERROR_MENU1_INSERT,
				errMessage: 'Internal Server Error, please try again'
			})
		));
});
menu1.delete('/delete', async (req, res) => {
	const { menu1ID, userID } = req.body;

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
		.catch(() => (res.status(500).send({
			Code: INTERNAL_SERVER_ERROR_MENU1_DELETE,
			errMessage: 'Internal Server Error, please try again'
		})));
});
menu1.post('/search', (req, res) => {
	const { menuName, userID } = req.body;

	db.orderBy('menu_id', 'desc')
		.select('menu_id', 'menu_name', 'seq')
		.from('tb_menu')
		.where('menu_name', '~*', menuName)
		.andWhere('menu_level', '=', 1)
		.andWhere('user_id', '=', userID)
		.then(menu => res.status(200).json(menu))
		.catch(() => (res.status(500).send({
			Code: INTERNAL_SERVER_ERROR_MENU1_SEARCH,
			errMessage: 'Internal Server Error, please try again'
		}))
		);
});
menu1.put('/update', async (req, res) => {
	const { menu1ID, menu1Name, seq, userID } = req.body;

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
		.catch(() => (res.status(500).send({
			Code: INTERNAL_SERVER_ERROR_MENU1_UPDATE,
			errMessage: 'Internal Server Error, please try again'
		})));
});

module.exports = menu1;

// const handleMenu1Get =(req,res,db) =>{
// 	db.orderBy('menu_id','desc')
// 	.	select('menu_name','seq','menu_path','menu_id')
// 	.from('tb_menu')
// 	.where({menu_level:1})
// 	.then(menu=>res.json(menu))
// 	.catch(err => res.status(400).json('error getting menu1')); 
// }


// const handleMenu1Post =(req,res,db)=>{
//   const {menu_name, menu_path, seq} = req.body;
//   db('tb_menu')
//   .returning(['menu_id','menu_name','menu_path','seq'])
//   .insert({
//   	menu_level: 1,
//     menu_name: menu_name,
//     menu_path: menu_path,
//     seq:seq,
//     created_date:new Date(),
//     created_by:'testingUser1',
//     last_updated_date:new Date(),
//     last_updated_by:'testingUser1'
//   })
//   .then(data=>res.json(data))
//   .catch(err => res.status(400).json(err));
// }

// const handleMenu1Delete=(req,res,db)=>{
// 	const {menu_id} = req.body;
// 	db('tb_menu')
// 	.where('menu_id', menu_id)
// 	.del()
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error delete menu1'));
// }

// const handleMenu1Search=(req,res,db)=>{
// 	const{menu_name,menu_path} = req.body;
// 	db.orderBy('menu_id','desc')
// 	.select('menu_id','menu_name'
// 		,'menu_path','seq')
// 	.from('tb_menu')
// 	.where('menu_name','~*',menu_name)
// 	.andWhere('menu_path','~*',menu_path)
// 	.andWhere('menu_level','=',1)
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error search menu1'));
// }

// const handleMenu1Update=(req,res,db)=>{
// 	const{menu_id,menu_name,menu_path,seq} = req.body;
// 	db('tb_menu')
// 	.where('menu_id', '=', menu_id)
// 	.update({
// 		menu_name: menu_name,
// 		menu_path: menu_path,
// 		seq:seq,
// 		last_updated_date:new Date(),
// 		last_updated_by:'testingUser1'
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error update menu1'))
// }


// module.exports = {
//   handleMenu1Get,
//   handleMenu1Post,
//   handleMenu1Delete,
//   handleMenu1Search,
//   handleMenu1Update
// }
