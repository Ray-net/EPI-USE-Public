const mongoose = require('mongoose');
/**
 *  @description connects to database
 */
const connectDB = async () => {
    try{
        const con = await mongoose.connect('mongodb+srv://Epiuse_Raymond:Bluemoon@cluster0.uu7bu8t.mongodb.net/EmployeeDB?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB