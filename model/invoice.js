const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const invoiceSchema = new Schema({
    invoiceId:{
        type : Number,
        required : true
    },
    date :{
        type: Date,
        required : true
    },
    customerId :{
        type : Schema.Types.ObjectId,
        ref : 'Customer',
        required : [true,'Customer ID is required']
    },
    salesman : {
        type : String,
        required : true
    },
    products : [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',required : [true,'Product ID is required'] },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    total :{
        type : Number,
        required : true
    }
});
invoiceSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.products.forEach(product => {
            delete product._id; // Remove the _id field
        });
        return ret;
    }
});
module.exports = mongoose.model('Invoice',invoiceSchema);