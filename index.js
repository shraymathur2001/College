// modules
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = require('./routes/userRoute');
const cors = require('cors');
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// database connection
mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    // if connected
    .then(() => {
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server is listening on port http://localhost:${port}/`);
        });
        console.log(`Database connected successfully`);
    })
    // if failed to connect
    .catch(() => {
        console.log("Failed to connect to database");
    });

// route
app.use(router);


