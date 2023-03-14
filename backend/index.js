const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const playerRoutes = require('./routes/Player.routes');
const buzzerRoutes = require('./routes/Buzzer.routes');


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.connect('mongodb://localhost:27017/buzzer', options);


const app = express();
app.use(express.json());
// load cors
// setup cors for localhost
app.use(cors({
    origin: ["http://92.222.177.232",/http:\/\/localhost*/,/http:\/\/192.168.*.*/],
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept','cookie','cookies']
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/buzzer', buzzerRoutes);
app.use('/player', playerRoutes);



app.listen(3000 ,() => {
    console.log('Server started on port 3000');
});

