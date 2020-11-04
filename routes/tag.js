const db = require('../database')
const express = require('express');
const tag = express.Router();
const { validateCreateTag } = require('../validation/validateTag/validateCreateTag'); 
const { validateDeleteTag } = require('../validation/validateTag/validateDeleteTag'); 
const { validateUpdateTag } = require('../validation/validateTag/validateUpdateTag'); 
const {  	INTERNAL_SERVER_ERROR_TAG_INSERT,
			INTERNAL_SERVER_ERROR_TAG_REQUEST,
			INTERNAL_SERVER_ERROR_TAG_SEARCH,
			INTERNAL_SERVER_ERROR_TAG_DELETE,
			INTERNAL_SERVER_ERROR_TAG_UPDATE
}  = require('../validation/validationConstants');

tag.post('/request', (req,res) => {
	const {userID} = req.body;
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.where('user_id', userID)
	.then(tags=>res.json(tags))
	.catch(() => res.status(500).json(
		{Code:INTERNAL_SERVER_ERROR_TAG_REQUEST,
			errMessage:'Internal Server Error, please click Search button to load tags again'})
	);
});

tag.post('/create', async (req,res) => {
	const {tag_name,seq,user_id} = req.body;

	const validationResult = await validateCreateTag(tag_name,seq,user_id);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}

	db('tb_tag')
  	.insert({
    	tag_name: tag_name,
	    seq:seq,
	    created_date:new Date(),
	    created_by:user_id,
	    last_updated_date:new Date(),
		last_updated_by:user_id,
		user_id:user_id
  	})
  	.then(result=>{
		  res.status(200).json(`command:${result.command},rowCount:${result.rowCount}`);
	})
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_INSERT,
		errMessage: 'Internal Server Error, please try again' 
	})));
	// .catch(err => {
	// 	console.log('tag create err',err);
	// 	res.status(400).json('error creating tag');
	// });
});

tag.delete('/delete', async (req,res) => {
	const {tagID, userID} = req.body;

	const validationResult = await validateDeleteTag(tagID,userID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}

	db('tb_tag')
	.where('tag_id', tagID)
	.andWhere('user_id',userID)
	.del()
	.then(data=>res.json(data))
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_DELETE,
		errMessage: 'Internal Server Error, please try again' 
	})));
});
tag.post('/search', (req,res) => {
	const{tag_name, user_id} = req.body;
	db.orderBy('tag_id','desc')
	.select('tag_id','tag_name','seq')
	.from('tb_tag')
	.where('tag_name','~*',tag_name)
	.andWhere('user_id','=',user_id)
	.then(data=>res.status(200).json(data))
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_SEARCH,
		errMessage: 'Internal Server Error, please try again' 
	})));
	// .catch(err => res.status(400).json('error search tag'));
});
tag.put('/update', async (req,res) => {
	const {tagID,tagName,seq,userID} = req.body;

	const validationResult = await validateUpdateTag(tagID,tagName,seq,userID);

	if (await validationResult.Status !== 200){
		return res.status(validationResult.Status).send({
			Code:validationResult.Code,
			errMessage:validationResult.errMessage
		});
	}
	db('tb_tag')
	.where('tag_id', '=', tagID)
	.andWhere('user_id','=',userID)
	.update({
		tag_name: tagName,
		seq:seq,
		last_updated_date:new Date(),
		last_updated_by:userID
	})
	.then(result=>{
		res.status(200).json(result);
	})
	.catch( ()=>(res.status(500).send({ 
		Code: INTERNAL_SERVER_ERROR_TAG_UPDATE,
		errMessage: 'Internal Server Error, please try again' 
	})));
	// .then(data=>res.json(data))
	// .catch(err => res.status(400).json('error update tag'))
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