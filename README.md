# object-search-key

[![NPM version](https://img.shields.io/npm/v/object-search-key.svg?style=flat)](https://npmjs.org/package/object-search-key)
[![NPM downloads](http://img.shields.io/npm/dm/object-search-key.svg?style=flat)](https://npmjs.org/package/object-search-key)
[![Build Status](https://travis-ci.com/alitajs/object-search-key.svg?branch=master)](https://travis-ci.com/alitajs/object-search-key)
[![Coverage Status](https://coveralls.io/repos/github/alitajs/object-search-key/badge.svg?branch=master)](https://coveralls.io/github/alitajs/object-search-key?branch=master)
[![License](https://img.shields.io/npm/l/object-search-key.svg)](https://npmjs.org/package/object-search-key)

Match the appropriate search keywords according to the key value definition of the object. Use [yaml-joi](https://github.com/alitajs/yaml-joi) as validator.

## Install

```bash
$ npm install object-search-key
or
$ yarn add object-search-key
```

## Example

```js
import { getObjectSearchKeys } from 'object-search-key';

const AccountModelDefine = `
type: object
isSchema: true
limitation:
  - keys:
      id:
        type: number
        isSchema: true
        limitation:
          - min: 0
          - max: 999999999
          - integer: []
      name:
        type: string
        isSchema: true
        limitation:
          - max: 32
      age:
        type: number
        isSchema: true
        limitation:
          - min: 0
          - integer: []
      locked:
        type: string
        isSchema: true
        limitation:
          - only: [Y, N]
`;

const searchInput = '123 hele xiaohuoni 24 1.2 N'.split(' ');
const search = getObjectSearchKeys(AccountModelDefine, searchInput);
/**
 * Result:
 * {
 *   id: ['123', '24'],
 *   name: ['123', 'hele', 'xiaohuoni', '24', '1.2', 'N'],
 *   age: ['123', '24'],
 *   locked: ['N'],
 * }
 */
const or = Object.entries(search).reduce((prev, [key, value]) => {
  return prev.concat(value.map(searchKey => ({ [key]: searchKey })));
}, []);

sequelize.Account.findAndCountAll({ where: { [Op.or]: or } });

/**
 * [
 *   { id: '123' },
 *   { id: '24' },
 *   { name: '123' },
 *   { name: 'hele' },
 *   { name: 'xiaohuoni' },
 *   { name: '24' },
 *   { name: '1.2' },
 *   { name: 'N' },
 *   { age: '123' },
 *   { age: '24' },
 *   { locked: 'N' },
 * ]
 */
```

Get more at [cases.yml](https://github.com/alitajs/object-search-key/blob/master/tests/cases.yml).
