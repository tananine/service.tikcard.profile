const bodyParser = require('body-parser');
const express = require('express');

const profileRouter = require('./routes/profile.routes');
const contactRouter = require('./routes/contact.routes');
const activationRouter = require('./routes/activation.routes');

const app = express();
app.use(bodyParser.json());

app.use('/profile', profileRouter);
app.use('/contact', contactRouter);
app.use('/activation', activationRouter);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3002);
