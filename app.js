const express = require('express');
const app = express();
const port = 6969;

app.get('/', (req, res) => {
  console.log(req.url)
  res.status(200).send({ message: 'HELLOOO, its me...', name: 'Natours by Hanzla'});
})

app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`)
})