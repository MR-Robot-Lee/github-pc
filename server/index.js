const express = require('express');
const morgan = require('morgan');
const path = require('path');
var favicon = require('serve-favicon');
const app = express();
const index = require('./router/index');


app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.locals = { title: '阿筑工程管理服务平台' };
app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/', index);
app.listen(80, () => {
  console.log('server started at port:80');
});