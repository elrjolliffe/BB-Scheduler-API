const express = require('express');
const path = require('path');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
  });