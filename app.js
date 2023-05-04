require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const profileRouter = require('./routes/profile.routes');
const contactRouter = require('./routes/contact.routes');
const activationRouter = require('./routes/activation.routes');
const viewRouter = require('./routes/view.routes');
const shareRouter = require('./routes/share.routes');
const connectionRouter = require('./routes/connection.routes');

const app = express();
app.use(bodyParser.json());

app.use('/profile', profileRouter);
app.use('/contact', contactRouter);
app.use('/activation', activationRouter);
app.use('/view', viewRouter);
app.use('/share', shareRouter);
app.use('/connection', connectionRouter);

app.use((error, req, res, next) => {
  const showClientMessage = error.showClientMessage;
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data, showClientMessage });
});

const PORT = process.env.PORT;
const listener = app.listen(PORT, () =>
  console.log('Server started on port ' + listener.address().port)
);
