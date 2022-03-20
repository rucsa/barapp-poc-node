import mongoose from 'mongoose'; 

const initDB = () => { 
    mongoose.connect('mongodb://127.0.0.1:27017/tc-admin');  
    mongoose.connection.once('open', () => { 
        console.log('connected to database'); 
    }); 
    mongoose.connection.on('error', console.error); 
} 

export default initDB;
