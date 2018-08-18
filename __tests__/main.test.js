/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const swaggerStrip = require('../index')

test('strip swagger', ()=> {
  expect(swaggerStrip()).toBe('123');
});