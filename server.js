"use strict"

const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');


const server =  http.createServer((req, res) => {
    console.log('requested', req.url);

    let currentUrl = url.parse(req.url, true).pathname;
    console.log(currentUrl);

    const filePath = path.join(__dirname, '/public',currentUrl === '/' ? '/index.html' : currentUrl);

    fs.readFile(filePath, (err, file) => {
        if (err){
            console.log('file read error', path, err);
            res.write('error 404');
            res.end();

            return;
        }

        res.write(file);
        res.end();
    });
});

server.listen(3000);