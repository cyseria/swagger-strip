# swagger-strip

[![build status](https://img.shields.io/travis/cyseria/swagger-strip/master.svg?style=flat-square)](https://travis-ci.org/cyseria/swagger-strip)
[![Test coverage](https://img.shields.io/codecov/c/github/cyseria/swagger-strip.svg?style=flat-square)](https://codecov.io/github/cyseria/swagger-strip?branch=master)
[![NPM version](https://img.shields.io/npm/v/swagger-strip.svg?style=flat-square)](https://www.npmjs.com/package/swagger-strip)
[![NPM Downloads](https://img.shields.io/npm/dm/swagger-strip.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/swagger-strip)

strip swagger from one api

## Usage

install

```bash
npm install swagger-strip
```

### Default Usage

A demo, data from [swagger deafult demo](https://editor.swagger.io/)

```javascript
const swaggerStrip = require('swagger-strip');
swaggerStrip(sourceObject, '/pet/findByStatus');

// => result
{
    paths: {
        tags: [ 'pet' ],
        summary: 'Finds Pets by status',
        ...
    },
    refs: { 
        '#/definitions/Pet': {
            type: 'object',
            required: [Array],
            properties: [Object],
            xml: [Object]
        },
        '#/definitions/Category': {...},
        '#/definitions/Tag': {...} },
    tags: [{
        name: 'pet',
        description: 'Everything about your Pets',
        ...
    }]
}
```

### Parse JSON File

```javascript
const fs = require('fs');
const path = require('path');
const swaggerStrip = require('swagger-strip');

const sourceJsonFile = path.join(__dirname, './test.json');
const sourceObject = JSON.parse(fs.readFileSync(sourceJsonFile, 'utf8'));

const res = swaggerStrip(sourceObject, '/pet/findByStatus');
```

### Parse YML File

parse .yml with [js-yaml](https://github.com/nodeca/js-yaml) or what you like;

```javascript
const sourceYmlFile = path.join(__dirname, './data/test.yml');
const sourceObject = yaml.safeLoad(fs.readFileSync(sourceYmlFile, 'utf8'));
const stripResult = swaggerStrip(sourceObject, '/pet', {
    method: 'post'
});
```

## API

### swaggerStrip(sourceObject, path, [options])

#### sourceObject

swagger source data, maybe you should parse json/yml file to object first

Type: `Object`

Default: {}

#### path

some api you want to strip

Type: `string`

Default: ''

Example: '/pet/findByStatus'

#### options

Type: Object

Params: 
- method: api method
    - when use `swaggerStrip(obj, '/pets')`, return paths will equal `obj['paths']['/pet/findByStatus']['get']`
    - when use `swaggerStrip(obj, '/pets', {method: 'post'})`, return paths equal `obj['paths']['/pet/findByStatus']['post']`

Default:
```
{
    method: `'get'`
}
```

## Development

```bash
npm install

# just test
npm run test

# commit with commitizen
npm run commit
```

## License

MIT
