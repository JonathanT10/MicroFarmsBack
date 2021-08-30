const express = require('express');
const connectDB = require('./startup/db');
const app = express();
const cors = require('cors');
const product = require('./routes/product');
const member = require('./routes/member')


connectDB();


app.use(express.json());
app.use(cors());
app.use('/api/product/', product);
app.use('/api/member/', member);
app.use('/uploads/', express.static('uploads'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.log(`Server started on port: ${port}`);
});
