const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const questionsRoutes = require('./routes/questions-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());
//users are able to go locate images that are uploaded
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
//app is able to make GET, POST, PATCH, DELETE Requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});
//able to go into questions routes and user routes
app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);
//unable to locate route, error outputs
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});
//able to retrive requested file, otherwise error is sent
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});
//connection to database using mongoose 
mongoose
  .connect(
    `mongodb+srv://dummy:test12345@cluster0.xglsh.mongodb.net/myPocketLegal?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
