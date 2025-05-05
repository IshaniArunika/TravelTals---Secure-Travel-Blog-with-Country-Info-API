const express = require('express');
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
require('./src/config/db');


dotenv.config();

const PORT = process.env.PORT || 5000;
const apiRouter = require('./src/routes/apiRoutes');
const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRouter')
const usageRoutes = require('./src/routes/usageRoutes');
const blogPostRouter = require('./src/routes/blogPostRoutes')
const app = express();

 
app.use(express.json()); // Parses incoming JSON requests
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only frontend
    credentials: true                // Enable sending cookies
  })); // Allows requests from different domains
app.use(express.urlencoded({ extended: true })); // support form data
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


app.use('/api', apiRouter); 
app.use('/auth', authRouter); 
app.use('/users', userRouter);
app.use('/api/usage', usageRoutes); 
app.use('/blog', blogPostRouter); 
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
