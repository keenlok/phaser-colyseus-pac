const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const Datauri = require('datauri');

const datauri = new Datauri()
const { JSDOM } = jsdom

app.use('/static', express.static('public'))

function setupAutohritativeServer () {
  JSDOM.fromFile(path.join(__dirname, 'index.html'), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  }).then((dom) => {
    dom.window.gameLoaded = () => {
      server.listen(3000, function () {
        console.log(`Listening on ${server.address().port}`);
      });
    }
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
      }
    }
    dom.window.URL.revokeObjectURL = (objectURL) => {
    };
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAutohritativeServer()