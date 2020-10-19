const express = require('express');
const config = require('./config');
const middleware = require('./middleware');
const routing = require('./routing');
const token = require('./token');

const app = express();

//Middleware
middleware(app);

//register
app.use('/register', require('./routes/register'));

//Login
app.use('/login', require('./routes/login'));

//token verify: All request below this, it would be verified.
app.use(token.verifyToken);

//routing
routing(app);

app.listen(config.port, ()=> {
  console.log(`app is running on port ${config.port}`);
});


//Middleware
// app.use(cors());
// app.use(express.json());

// const topbar = require('./controllers/topbar');
// const sidebar = require('./controllers/sidebar');
// const bloglist = require('./controllers/bloglist');
// const blog = require('./controllers/blog');
// const category = require('./controllers/category');
// const tag = require('./controllers/tag');
// const menu1 = require('./controllers/menu1');
// const menu2 = require('./controllers/menu2');

//Debug for SQL
// var toStringQuery = db.select.toString()
//   console.log('toStringQuery',toStringQuery);


//Home
// app.get('/',(req, res)=>res.json('Hello World'));

//Topbar
// app.get('/topbar',(req, res)=>{topbar.handleTopbarGet(req, res, db)})
// app.use('/topbar',require('./controllers/topbar'));

//Sidebar
// app.use('/sidebar',require('./controllers/sidebar'));
// app.get('/sidebar/id/:topbarMenuID', (req, res)=> {sidebar.handleSidebarGetByID(req,res,db)})
// app.get('/sidebar/path/:topbarMenuPath',(req, res)=>{sidebar.handleSidebarGetByPath(req,res,db)})

//Bloglist
// app.use('/bloglist',require('./controllers/bloglist'));
// app.get('/bloglist/path/:sidebarMenuPath',(req, res)=>{bloglist.handleBloglistGet(req,res,db)})
// app.post('/bloglist/search', (req, res)=> {bloglist.handleBloglistSearch(req,res,db)})

//Blog
// app.use('/blog',require('./controllers/blog'));
// app.get('/blog/path/:blogPath', (req, res)=> {blog.handleBlogGet(req,res,db)})
// app.get('/blog/tag/path/:blogPath', (req,res)=>{blog.handleBlogTagGetByBlogPath(req,res,db)})
// app.get('/blog/category/get',(req,res)=> {blog.handleBlogCategoryGet(req,res,db)})
// app.post('/blog/category/search',(req,res)=>{blog.handleBlogCategorySearch(req,res,db)})
// app.get('/blog/tag/get',(req,res)=>{blog.handleBlogTagGet(req,res,db)})
// app.post('/blog/tag/search',(req,res)=>{blog.handleBlogTagSearch(req,res,db)})
// app.post('/blog/create',(req,res)=>{blog.handleBlogPost(req,res,db)})
// app.put('/blog/update', (req,res)=>{blog.handleBlogUpdate(req,res,db)})
// app.delete('/blog/delete', (req,res)=>{blog.handleBlogDelete(req,res,db)})

//Category
// app.use('/category',require('./controllers/category'));

// app.get('/category/get', (req, res)=> {category.handleCategoryGet(req,res,db)})
// app.post('/category/create',(req,res)=>{category.handleCategoryPost(req,res,db)})
// app.delete('/category/delete',(req,res)=>{category.handleCategoryDelete(req,res,db)})
// app.post('/category/search',(req,res)=>{category.handleCategorySearch(req,res,db)})
// app.put('/category/update',(req,res)=>{category.handleCategoryUpdate(req,res,db)})

//Tag
// app.use('/tag',require('./controllers/tag'));

// app.get('/tag/get', (req, res)=> {tag.handleTagGet(req,res,db)})
// app.post('/tag/create',(req,res)=>{tag.handleTagPost(req,res,db)})
// app.delete('/tag/delete',(req,res)=>{tag.handleTagDelete(req,res,db)})
// app.post('/tag/search',(req,res)=>{tag.handleTagSearch(req,res,db)})
// app.put('/tag/update',(req,res)=>{tag.handleTagUpdate(req,res,db)})

//Menu1
// app.use('/menu1',require('./controllers/menu1'));

// app.get('/menu1/get', (req,res)=>{menu1.handleMenu1Get(req,res,db)})
// app.post('/menu1/create',(req,res)=>{menu1.handleMenu1Post(req,res,db)})
// app.delete('/menu1/delete',(req,res)=>{menu1.handleMenu1Delete(req,res,db)})
// app.post('/menu1/search',(req,res)=>{menu1.handleMenu1Search(req,res,db)})
// app.put('/menu1/update',(req,res)=>{menu1.handleMenu1Update(req,res,db)})

//Menu2
// app.use('/menu2',require('./controllers/menu2'));

// app.get('/menu2/get', (req,res)=>{menu2.handleMenu2Get(req,res,db)})
// app.post('/menu2/create',(req,res)=>{menu2.handleMenu2Post(req,res,db)})
// app.delete('/menu2/delete',(req,res)=>{menu2.handleMenu2Delete(req,res,db)})
// app.post('/menu2/search',(req,res)=>{menu2.handleMenu2Search(req,res,db)})
// app.put('/menu2/update',(req,res)=>{menu2.handleMenu2Update(req,res,db)})




