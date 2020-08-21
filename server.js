// import express from 'express';
// import cors from 'cors';
// import knex from 'knex';

const express = require('express');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '123a123a',
    database : 'books'
  }
});


const app = express();
app.use(cors());
app.use(express.json());

app.get('/topbar', (req, res)=> {
	db.select('menu_name','seq','menu_path','menu_id')
	.from('tb_menu')
  .where({menu_level:1})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('error getting menu'));
});

app.get('/sidebar/id/:topbarMenuID', (req, res)=> {
  const { topbarMenuID } = req.params;
  
  db.select('menu_name','seq','menu_path','menu_id')
  .from('tb_menu')
  .where({parent_menu_id:topbarMenuID, menu_level:2})
  .then(menu=>res.json(menu))
  .catch(err => res.status(400).json('erro getting sidebar by id'));
});

app.get('/sidebar/path/:topbarMenuPath', (req, res)=> {
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

app.get('/bloglist/path/:sidebarMenuPath', (req, res)=> {
   const { sidebarMenuPath } = req.params;

  db.select('tb.blog_id','tb.blog_title',
    'tb.blog_content','tb.seq',
    'tb.blog_path','bc.blog_category_name')
  .from('tb_blog as tb')
  .join('tb_menu as tm', function() {
    this.on('tb.menu_id', '=', 'tm.menu_id')
      .andOn('tm.menu_path', '=',db.raw('?',[sidebarMenuPath]))
  })
  .join('tb_blog_category as bc', 'bc.blog_category_id', 'tb.blog_category_id')
  .then(bloglist=>res.json(bloglist))
  .catch(err => res.status(400).json('error getting blog'));
});


app.get('/blog/path/:blogPath', (req, res)=> {
   const { blogPath } = req.params;

  db.select('tb.blog_id','tb.blog_title','tb.blog_content',
    'tb.seq', 'bc.blog_category_name',
    'tb.blog_path')
  .from('tb_blog as tb')
  .join('tb_blog_category as bc', function() {
    this.on('tb.blog_category_id', '=', 'bc.blog_category_id')
      .andOn('tb.blog_path', '=',db.raw('?',[blogPath]))
  })
  .then(blog=>res.json(blog))
  .catch(err => res.status(400).json('error getting blog'));
});


app.get('/category/get', (req, res)=> {
  db.orderBy('blog_category_id','desc')
  .select('blog_category_id','blog_category_name','blog_category_desc','seq')
  .from('tb_blog_category')
  .then(categories=>res.json(categories))
  .catch(err => res.status(400).json('error getting category'));
});


app.post('/category/create',(req,res)=>{
  const {blog_category_name, blog_category_desc, seq} = req.body;
  // console.log('req.body',req.body);
  db('tb_blog_category')
  .returning(['blog_category_id','blog_category_name','blog_category_desc','seq'])
  .insert({
    blog_category_name: blog_category_name,
    blog_category_desc:blog_category_desc,
    seq:seq,
    created_date:new Date(),
    created_by:'testingUser1',
    last_updated_date:new Date(),
    last_updated_by:'testingUser1'
  })
  .then(data=>res.json(data))
  .catch(err => res.status(400).json('error creating category'));

});

app.delete('/category/delete',(req,res)=>{
  const {blog_category_id} = req.body;
  db('tb_blog_category')
  .where('blog_category_id', blog_category_id)
  .del()
  .then(data=>res.json(data))
  .catch(err => res.status(400).json('error delete category'));

})

app.post('/category/search',(req,res)=>{
  const{blog_category_name,blog_category_desc} = req.body;
  db.select('blog_category_id','blog_category_name'
    ,'blog_category_desc','seq')
  .from('tb_blog_category')
  .where('blog_category_name','~*',blog_category_name)
  .andWhere('blog_category_desc','~*',blog_category_desc)
  .then(data=>res.json(data))
  .catch(err => res.status(400).json('error search category'));

// var toStringQuery = db.select('blog_category_id','blog_category_name'
//     ,'blog_category_desc','seq')
//   .from('tb_blog_category')
//   .where('blog_category_name','~*',blog_category_name)
//   .andWhere('blog_category_desc','~*',blog_category_desc)
//   .toString()
//   console.log('toStringQuery',toStringQuery);


})

app.put('/category/update',(req,res)=>{
  const{blog_category_id,blog_category_name,blog_category_desc,seq} = req.body;
  db('tb_blog_category')
  .where('blog_category_id', '=', blog_category_id)
  .update({
    blog_category_name: blog_category_name,
    blog_category_desc: blog_category_desc,
    seq:seq
  })
  .then(data=>res.json(data))
  .catch(err => res.status(400).json('error update category'));


})

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
});

