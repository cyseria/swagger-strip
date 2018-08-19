/**
 * @file index
 * @author cyseria
 * @description
 */

const path = require('path');
const swaggerStrip = require('./src/index');
const sourceFile = path.relative(__dirname, './data/test.json');

const stripResult = swaggerStrip(sourceFile, '/pet', {
    method: 'post'
});
console.log(stripResult);


