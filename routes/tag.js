const db = require('../database')
const express = require('express');
const tag = express.Router();

tag.get('/get', (req,res) => {
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.then(tags=>res.json(tags))
	.catch(err => res.status(400).json('error getting tag'));
});
tag.post('/create', (req,res) => {
	const {tag_name,seq} = req.body;
  // console.log('req.body',req.body);
	db('tb_tag')
  	.insert({
    	tag_name: tag_name,
	    seq:seq,
	    created_date:new Date(),
	    created_by:'testingUser1',
	    last_updated_date:new Date(),
	    last_updated_by:'testingUser1'
  	})
  	.then(data=>res.json(data))
  	.catch(err => res.status(400).json('error creating tag'));
});
tag.delete('/delete', (req,res) => {
	const {tag_id} = req.body;
	db('tb_tag')
	.where('tag_id', tag_id)
	.del()
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error delete tag'));
});
tag.post('/search', (req,res) => {
	const{tag_name} = req.body;
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.where('tag_name','~*',tag_name)
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error search tag'));
});
tag.put('/update', (req,res) => {
	const{tag_id,tag_name,seq} = req.body;
	db('tb_tag')
	.where('tag_id', '=', tag_id)
	.update({
		tag_name: tag_name,
		seq:seq,
		last_updated_date:new Date(),
		last_updated_by:'testingUser1'
	})
	.then(data=>res.json(data))
	.catch(err => res.status(400).json('error update tag'))
});

module.exports = tag


// const handleTagGet =(req,res,db)=>{
// 	db.orderBy('tag_id','desc')
// 	.select('tag_id','tag_name','seq')
// 	.from('tb_tag')
// 	.then(tags=>res.json(tags))
// 	.catch(err => res.status(400).json('error getting tag'));
// }

// const handleTagPost =(req,res,db)=>{
//   const {tag_name,seq} = req.body;
//   // console.log('req.body',req.body);
//   db('tb_tag')
//   .insert({
//     tag_name: tag_name,
//     seq:seq,
//     created_date:new Date(),
//     created_by:'testingUser1',
//     last_updated_date:new Date(),
//     last_updated_by:'testingUser1'
//   })
//   .then(data=>res.json(data))
//   .catch(err => res.status(400).json('error creating tag'));
// }

// const handleTagDelete=(req,res,db)=>{
// 	const {tag_id} = req.body;
// 	db('tb_tag')
// 	.where('tag_id', tag_id)
// 	.del()
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error delete tag'));
// }

// const handleTagSearch=(req,res,db)=>{
// 	const{tag_name} = req.body;
// 	db.orderBy('tag_id','desc')
// 	.select('tag_id','tag_name','seq')
// 	.from('tb_tag')
// 	.where('tag_name','~*',tag_name)
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error search tag'));
// }

// const handleTagUpdate=(req,res,db)=>{
// 	const{tag_id,tag_name,seq} = req.body;
// 	db('tb_tag')
// 	.where('tag_id', '=', tag_id)
// 	.update({
// 		tag_name: tag_name,
// 		seq:seq,
// 		last_updated_date:new Date(),
// 		last_updated_by:'testingUser1'
// 	})
// 	.then(data=>res.json(data))
// 	.catch(err => res.status(400).json('error update tag'))
// }


// module.exports = {
//   handleTagGet,
//   handleTagPost,
//   handleTagDelete,
//   handleTagSearch,
//   handleTagUpdate
// }