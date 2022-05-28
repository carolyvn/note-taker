const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Display notes from db.json 
app.get('/api/notes', (req, res) => {
    fs.readFile('/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        };
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

// Default to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Save notes to db.json
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        };
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid();
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.log(err);
            };
        });
        res.json(newNote);
    });    
});


// Delete notes from db.json
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        };
        const notes = JSON.parse(data);
        notes.splice(req.params.id, 1);

        fs.writeFile('./db.db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.log(err);
            } else {
                return notes;
            }
        })
    });

})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}.`)
});

