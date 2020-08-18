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
	.from('tb_menu').where({menu_level:1})
	.then(menu=>res.json(menu))
	.catch(err => res.status(400).json('error getting menu'));
});

app.get('/sidebar/id/:topbarMenuID', (req, res)=> {
  const { topbarMenuID } = req.params;
  
  db.select('menu_name','seq','menu_path','menu_id')
  .from('tb_menu').where({parent_menu_id:topbarMenuID, menu_level:2})
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

  db.select('tb.blog_id','tb.blog_title','tb.blog_content','tb.seq')
  .from('tb_blog as tb')
  .join('tb_menu as tm', function() {
    this.on('tb.menu_id', '=', 'tm.menu_id')
      .andOn('tm.menu_path', '=',db.raw('?',[sidebarMenuPath]))
  })
  .then(blog=>res.json(blog))
  .catch(err => res.status(400).json('error getting blog'));
});

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
});

