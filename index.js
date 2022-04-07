const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express()

//localhost
const port = process.env.PORT || 5000

//middleware
app.use(cors());

// Get data from client site

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2bif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        console.log('database connected');
        // database
        const database = client.db('library');

        // connections
        const coursesCollection = database.collection('courses');
        const usersCollection = database.collection('users');
        const enrollcollections = database.collection('enroll');

        // Get courses API

        app.get('/courses', async (req, res) => {
            const cursor = coursesCollection.find({});
            const courses = await cursor.toArray();
            res.send(courses);
        })

        // post courses API
        app.post('/courses', async (req, res) => {
            const course = req.body;
            console.log('hit the post', course)

            const result = await coursesCollection.insertOne(course);
            res.json(result);
        })

        //post user API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result);
        })

        //get user API 

        //get enroll API

        app.get('/enroll', async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = { email: email }
            }
            const cursor = enrollcollections.find(query);
            const enrolls = await cursor.toArray();
            res.send(enrolls);
        });


        //post enrollments

        app.post('/enroll', async (req, res) => {
            const enroll = req.body;
            const result = await enrollcollections.insertOne(enroll);
            res.json(result);
        });

        // delete courses api

        app.delete('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await coursesCollection.deleteOne(query);
            console.log('delete', result)
            res.json(result);
        })
        // delete enroll api
        app.delete('/enroll/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await enrollcollections.deleteOne(query);
            console.log('delete', result);
            res.json(result);
        })


    }




    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
