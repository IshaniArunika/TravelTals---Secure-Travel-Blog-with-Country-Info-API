const express =  require('express');
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
 

const app = express();
dotenv.config();
 


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);   
})


 


