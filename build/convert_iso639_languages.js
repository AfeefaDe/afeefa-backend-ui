/*
 * Script takes language JSON from http://heimsath.org/blog/articles/iso-sprachen/ (saved as isolanguages.json)
 * and converts it into a customized JSON format that is than put into /src/helpers/iso_639_languages#data
 */

var fs = require('fs');

var input = require('./solanguages.json');

function createOutput(fileName) {
  let finalResult = [];
  for(let key in input) {
    let lang = input[key]
    if (lang.iso639v1.length>0) finalResult.push({'de' : lang.german, 'en' : lang.english, 'iso639v1': lang.iso639v1})
  }
  fs.writeFileSync('./'+fileName, JSON.stringify(finalResult, null, 2).replace(/"/g, "'"), 'utf-8');
}
/* create files */
createOutput('lang.json');

