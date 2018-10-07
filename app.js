const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('HEllo world');
});

app.listen(3000, () => {
    console.log('server strted ..');
});