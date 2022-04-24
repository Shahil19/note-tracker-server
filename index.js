const express = require('express');
const app = express();
const port = 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(express.json());
//shahil
//qtz4pxj3zI1FNgUX


const uri = "mongodb+srv://shahil:qtz4pxj3zI1FNgUX@cluster0.tjzjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const notesCollections = client.db("noteTracker").collection("notes");

        // get - find users section
        // http://localhost:4000/notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            console.log(q);

            const cursor = notesCollections.find(q)
            const result = await cursor.toArray();
            res.send(result)
        })



        // post - add docs section
        // http://localhost:4000/note
        /* 
        body: {
                "name": "galib",
                "text": "I love poetry"
              }
        */
        app.post('/note', async (req, res) => {
            const data = req.body;
            const result = await notesCollections.insertOne(data)
            res.send(result)
        })


        // update - put docs section
        // `http://localhost:4000/note/${id}`
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const updatedNote = req.body;
            console.log(updatedNote);

            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...updatedNote
                },
            };

            const result = await notesCollections.updateOne(filter, updateDoc, options);
            res.send(updatedNote)
        })

        // delete - delete docs section
        //http://localhost:4000/note/${id}
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await notesCollections.deleteOne(query)
            res.send(result);
        })
    } finally {
    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log(`listening ${port}`);
})