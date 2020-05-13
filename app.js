const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const PORT = process.env.PORT || 3005;


const app = express();
app.get('/',(req,res,next)=>{
  res.send('Welcome to my tutoring app');

})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);

mongoose.connect("mongodb+srv://bashirrn3:bashooo1994@cluster0-pa2ru.mongodb.net/tutoring?retryWrites=true&w=majority",
	{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log("Database connected");
  })
  .catch(err => console.log(err));

app.listen(PORT, () =>{console.log(`listening on port ${PORT}`);})