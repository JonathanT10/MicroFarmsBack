const express = require('express');
const connectDB = require('./startup/db');
const app = express();
const cors = require('cors');
const product = require('./routes/product');


connectDB();


app.use(express.json());
app.use(cors());
app.use('/api/product/', product);

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.log(`Server started on port: ${port}`);
});
