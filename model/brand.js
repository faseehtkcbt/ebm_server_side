const mongoose = require('mongoose');

// Define the Brand schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], //Adding custom error message
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: [true, 'Category ID is required']
    }
},{ timestamps: true });

// Create the Brand model
const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
