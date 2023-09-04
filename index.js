const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'))

//router
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/board', (req, res) => {
    res.render('board');
});

app.get('/boardwrite', (req, res) => {
    res.render('boardwrite');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
