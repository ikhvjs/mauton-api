const express = require('express');
const cors = require('cors');
const knex = require('knex');

const topbar = require('./controllers/topbar');
const sidebar = require('./controllers/sidebar');
const bloglist = require('./controllers/bloglist');
const blog = require('./controllers/blog');
const category = require('./controllers/category');
const tag = require('./controllers/tag');
const menu1 = require('./controllers/menu1');
const menu2 = require('./controllers/menu2');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '123a123a',
    database : 'books'
  }
});

//Debug for SQL
// var toStringQuery = db.select.toString()
//   console.log('toStringQuery',toStringQuery);


const app = express();
app.use(cors());
app.use(express.json());

//Topbar
app.get('/topbar',(req, res)=>{topbar.handleTopbarGet(req, res, db)})

//Sidebar
app.get('/sidebar/id/:topbarMenuID', (req, res)=> {sidebar.handleSidebarGetByID(req,res,db)})
app.get('/sidebar/path/:topbarMenuPath',(req, res)=>{sidebar.handleSidebarGetByPath(req,res,db)})

//Bloglist
app.get('/bloglist/path/:sidebarMenuPath',(req, res)=>{bloglist.handleBloglistGet(req,res,db)})
app.post('/bloglist/search', (req, res)=> {bloglist.handleBloglistSearch(req,res,db)})

//Blog
app.get('/blog/path/:blogPath', (req, res)=> {blog.handleBlogGet(req,res,db)})
app.get('/blog/tag/path/:blogPath', (req,res)=>{blog.handleBlogTagGet(req,res,db)})
app.get('/blog/category/get',(req,res)=> {blog.handleBlogCategoryGet(req,res,db)})
app.post('/blog/category/search',(req,res)=>{blog.handleBlogCategorySearch(req,res,db)})

//Category
app.get('/category/get', (req, res)=> {category.handleCategoryGet(req,res,db)})
app.post('/category/create',(req,res)=>{category.handleCategoryPost(req,res,db)})
app.delete('/category/delete',(req,res)=>{category.handleCategoryDelete(req,res,db)})
app.post('/category/search',(req,res)=>{category.handleCategorySearch(req,res,db)})
app.put('/category/update',(req,res)=>{category.handleCategoryUpdate(req,res,db)})

//Tag
app.get('/tag/get', (req, res)=> {tag.handleTagGet(req,res,db)})
app.post('/tag/create',(req,res)=>{tag.handleTagPost(req,res,db)})
app.delete('/tag/delete',(req,res)=>{tag.handleTagDelete(req,res,db)})
app.post('/tag/search',(req,res)=>{tag.handleTagSearch(req,res,db)})
app.put('/tag/update',(req,res)=>{tag.handleTagUpdate(req,res,db)})

//Menu1
app.get('/menu1/get', (req,res)=>{menu1.handleMenu1Get(req,res,db)})
app.post('/menu1/create',(req,res)=>{menu1.handleMenu1Post(req,res,db)})
app.delete('/menu1/delete',(req,res)=>{menu1.handleMenu1Delete(req,res,db)})
app.post('/menu1/search',(req,res)=>{menu1.handleMenu1Search(req,res,db)})
app.put('/menu1/update',(req,res)=>{menu1.handleMenu1Update(req,res,db)})

//Menu2
app.get('/menu2/get', (req,res)=>{menu2.handleMenu2Get(req,res,db)})
app.post('/menu2/create',(req,res)=>{menu2.handleMenu2Post(req,res,db)})
app.delete('/menu2/delete',(req,res)=>{menu2.handleMenu2Delete(req,res,db)})
app.post('/menu2/search',(req,res)=>{menu2.handleMenu2Search(req,res,db)})
app.put('/menu2/update',(req,res)=>{menu2.handleMenu2Update(req,res,db)})

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
});

