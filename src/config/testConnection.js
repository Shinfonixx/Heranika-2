const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connection successful!');
        console.log(`Connected to: ${mongoose.connection.name}`);
        
        await mongoose.disconnect();
        console.log('Disconnected successfully');
    } catch (error) {
        console.error('Connection failed:');
        console.error(`Error type: ${error.name}`);
        console.error(`Details: ${error.message}`);
    }
}

testConnection();