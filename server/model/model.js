const mongoose = require('mongoose');
/**
 *  @description model for the MongoDB employees
 */

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    surname : {
        type : String,
        required: true
    },
    dateOfBirth : {
        type : Date,
        required: true
    },
    employeeNumber : {
        type: String,
        required: true,
        unique: true
    },
    manager : {
        type : String,
        required: false
    },
    salary : {
        type : Number,
        required: false
    },
    role : {
        type : String,
        required: true
    },
    email: String
    
})

const employee = mongoose.model('employeedb', schema);

module.exports = employee;