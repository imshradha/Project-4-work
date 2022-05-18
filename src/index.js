const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
const DB_URI = 'mongodb://localhost:27017/urlshortener'


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Himanshu-Chauhan:9760293354abcde@cluster0.3lxw1.mongodb.net/Group7DB-Project4", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected successfully......."))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});