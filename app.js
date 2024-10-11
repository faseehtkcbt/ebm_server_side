const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
//?Middle wair
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
// //? setting static folder path
// app.use('/image/products', express.static('public/products'));
// app.use('/image/category', express.static('public/category'));
// app.use('/image/poster', express.static('public/posters'));

const URL = process.env.MONGO_URL;
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
app.use('/categories', require('./routes/category'));
app.use('/brands', require('./routes/brand'));
app.use('/areas', require('./routes/area'));
app.use('/products', require('./routes/product'));
app.use('/customers', require('./routes/customer'));
app.use('/invoices', require('./routes/invoice'));
app.use('/salesreport',require('./routes/salesreport'));
app.use('/auth',require('./routes/auth'));




// app.use('/variantTypes', require('./routes/variantType'));
// app.use('/variants', require('./routes/variant'));
// app.use('/couponCodes', require('./routes/couponCode'));
// app.use('/posters', require('./routes/poster'));
// app.use('/users', require('./routes/user'));
// app.use('/orders', require('./routes/order'));


// Example route using asyncHandler directly in app.js
app.get('/', asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'API working successfully', data: null });
}));

// Global error handler
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ success: false,message: message, data: data });
  });


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});


