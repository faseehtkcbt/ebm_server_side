const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    code: {
        type: String,
        required: true
      },
    name: {
        type: String,
        required: true
      }, 
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: [true, 'Area ID is required']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category ID is required']
      }

});


module.exports = mongoose.model('Customer',customerSchema);