const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type :String,
        required : true
    },
    description: {
        type: String,
        required: true
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

module.exports = mongoose.model('Event', eventSchema);