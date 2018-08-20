/**
 * @file main test
 * @author cyseria
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerStrip = require('..');

const sourceJsonFile = path.join(__dirname, './data/test.json');
const sourceCode = fs.readFileSync(sourceJsonFile, 'utf8');
const sourceObject = JSON.parse(sourceCode);

const wishPetRefs = {
    '#/definitions/Pet': sourceObject['definitions']['Pet'],
    '#/definitions/Category': sourceObject['definitions']['Category'],
    '#/definitions/Tag': sourceObject['definitions']['Tag']
};
const wishPetTags = [sourceObject['tags'][0]];

describe('main test', () => {
    it('should strip "/pet/findByStatus" api from source object', () => {
        const stripResult = swaggerStrip(sourceObject, '/pet/findByStatus');
        const wishPetFindByStatusPaths = sourceObject['paths']['/pet/findByStatus']['get'];
        expect(stripResult.paths).toEqual(wishPetFindByStatusPaths);
        expect(stripResult.refs).toEqual(wishPetRefs);
        expect(stripResult.tags).toEqual(wishPetTags);
    });

    it('should strip custom method from source object', () => {
        const stripResult = swaggerStrip(sourceObject, '/pet', {
            method: 'post'
        });
        const wishPetPaths = sourceObject['paths']['/pet']['post'];
        expect(stripResult.paths).toEqual(wishPetPaths);
        expect(stripResult.refs).toEqual(wishPetRefs);
        expect(stripResult.tags).toEqual(wishPetTags);
    });
});

describe('files test', () => {
    it('should strip custom method from yml file', () => {
        const sourceYmlFile = path.join(__dirname, './data/test.yml');
        const sourceCode = fs.readFileSync(sourceYmlFile, 'utf8');
        const sourceObject = yaml.safeLoad(sourceCode);
        const stripResult = swaggerStrip(sourceObject, '/pet', {
            method: 'post'
        });
        const wishPetPaths = sourceObject['paths']['/pet']['post'];
        expect(stripResult.paths).toEqual(wishPetPaths);
        expect(stripResult.refs).toEqual(wishPetRefs);
        expect(stripResult.tags).toEqual(wishPetTags);
    });
})
