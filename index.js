const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



var app = express();
app.use(cors());
app.use(bodyParser.json());


//database connection
const uri = process.env.DB_PATH;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello world');
})

//appointments for dates
app.post('/appointmentsForDate', (req, res) => {
    const date = req.body;
    console.log("date is ", req.body)
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.find().toArray((error, documents) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: error });
            }
            else {
                console.log(documents)
                res.send(documents);
            }
        })
    })
})

//appointments
app.post('/appointments', (req, res) => {
    const appointment = req.body;
    console.log(req.body)
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        collection.insertOne(appointment, (error, result) => {
            if (error) {
                console.log("faild to connect", error);
                res.status(500).send({ message: error });
            } else {
                console.log("connected successfully", result.ops[0]);
                res.send(result.ops[0]);
            }
        })
    })
})

const port = process.env.PORT || 4500;
app.listen(port, () => console.log('listening to port 4500'));