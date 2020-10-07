const express = require('express');
// const path = require('path');

const app = express();
// const srcFolder = path.resolve(__dirname, '/source');

app.use(express.static(`${__dirname}/source`));

const port = 80;

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/source/index.html`);
});

app.listen(port, () => {
    console.log(`Server listening port ${port}`);
});
