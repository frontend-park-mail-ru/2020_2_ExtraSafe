const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/dist`));

const port = 3033;

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(port, () => {
    console.log(`Server listening port ${port}`);
});
