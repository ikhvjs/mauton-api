const express = require('express');
const config = require('./config');
const middleware = require('./middleware');
const routing = require('./routing');
const token = require('./token');

const app = express();

//Middleware
middleware(app);

//For testing purpose
app.get('/',(req, res)=>res.json('Hello World'));
  
//register
app.use('/register', require('./routes/register'));

//Login
app.use('/login', require('./routes/login'));

app.use(token.verifyToken); //token verify: All request below this, it would be verified.

//routing
routing(app);

app.listen(config.port, ()=> {
  console.log(`app is running on port ${config.port}`);
});