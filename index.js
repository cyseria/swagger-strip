/**
 * @file index
 * @author cyseria
 * @description
 */

const path = require('path');
const swaggerStrip = require('./src/index');
const sourceFile = path.relative(__dirname, './data/test.json')

swaggerStrip(sourceFile, '/pet', {
    method: 'post'
});


