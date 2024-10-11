const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    code :{
        type: String,
        required : true
    },
    name :{
        type: String,
        required : true
    },
    description: {
        type: String,
        trim: true
    },
    brand : {
        type : Schema.Types.ObjectId,
        ref : 'Brand',
        required :  [true, 'Brand ID is required']
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category', 
        required: [true, 'Category ID is required']
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Product',productSchema);