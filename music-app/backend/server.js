const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

let compositions = [];

app.post('/save-composition', (req, res) => {
  const { composition } = req.body;
  if (composition) {
    compositions.push(composition);
    res.status(200).send('Composition saved');
  } else {
    res.status(400).send('Invalid composition');
  }
});

app.get('/get-compositions', (req, res) => {
  res.status(200).json(compositions);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
