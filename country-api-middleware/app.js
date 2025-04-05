const express = require('express');
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
 

dotenv.config();

const PORT = process.env.PORT || 4000;
const apiRouter = require('./src/routes/apiRoutes');
const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRouter')
const app = express();

 
app.use(express.json()); // Parses incoming JSON requests
app.use(cookieParser());
app.use(cors()); // Allows requests from different domains

app.use('/api', apiRouter); 
app.use('/auth', authRouter); 
app.use('/users', userRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
