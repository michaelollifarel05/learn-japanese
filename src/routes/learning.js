const express = require('express');
const dictionary = require('../../public/data/dictionary.json');
const grammar = require('../../public/data/grammar.json');
const router = express.Router();

router.get('/health', (request, response) => {
  response.json({ status: 'ok' });
});
router.get('/dictionary', (request, response) => {
  response.json(dictionary);
});
router.get('/grammar', (request, response) => {
  response.json(grammar);
});
module.exports = router;
