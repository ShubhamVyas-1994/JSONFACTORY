const express = require('express');
const app = express();
// Body parser
let bodyParser = require('body-parser');
import morgan from 'morgan';
var multer = require('multer');
var upload = multer();
// Taking care of cors policy
import cors from 'cors';
// CORS Middleware
app.use(cors());

// Parsing Json from req
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// Logging all request
// Logger Middleware
app.use(morgan('dev'));

let firstVersionApi = require('./src/v1/route');
app.use('/api/v1', firstVersionApi)


export default app;
