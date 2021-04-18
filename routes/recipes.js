var express = require('express')
var router = express.Router()
var fetch = require('node-fetch')
var cheerio = require('cheerio')
var superagent = require('superagent')

/* POST URL from form */
router.post('/', async (req, res, next) => {
  (async () => {
      const response = await superagent(req.body.url);
      const $ = cheerio.load(response.text);
      // note that I'm not using .html(), although it works for me either way
      const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data;
      // do not use JSON.stringify on the jsonRaw content, as it's already a string
      const result = JSON.parse(jsonRaw);
      const graph = result['@graph'];
      const recipe = graph.filter((item) => {
        return (item['@type'] == 'Recipe') ? item : false;
      })

      res.render('recipe', {
        data: recipe[0]
      })
  })()
});

module.exports = router;
