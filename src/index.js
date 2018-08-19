/**
 * @file
 * @author cyseria
 */

const fs = require('fs');
const utils = require('./utils');


/**
 * 根据 path 抽离 swagger 字段
 * @param {string} sourceFile 文件所在的绝对路径
 * @param {string} path 需要获取的路径内容
 * @param {Object} options 额外配置
 * @return {{refs: Object, interfaceData: Object, tags: Object}}
 * feature: path 为 Array
 */
module.exports = function swaggerStrip(sourceFile, path = '/pet', options) {
    const sourceCode = fs.readFileSync(sourceFile, { encoding: 'utf8' });
    const sourceObject = JSON.parse(sourceCode);
    // 解析接口
    const paths =  stripInterface(sourceObject.paths, path, options);
    let refs = {};
    let tags = [];
    if (!!paths) {
        // 解析引用的内容 $refs
        const refFlattenArrs = flattenRefs(paths);
        refFlattenArrs.forEach(item => {
            const ref = getRefs(item, sourceObject);
            refs = Object.assign(refs, ref);
        });

        // 解析 tags
        if (utils.hasOwnProp(paths, 'tags')) {
            tags = stripTags(paths.tags, sourceObject.tags);
        }
    }
    return {paths, refs, tags};
};

/**
 * 抽离 tags
 * @param {Array} tags - 接口 path 里面的 tags 字段
 * @param {Object} sourceTags - 定义的 tags 列表
 * @return {Array}
 */
function stripTags(tags, sourceTags) {
    const returnTags = [];
    tags.forEach(tag => {
        const tagItem = sourceTags.find(item => {
            return item.name === tag;
        });
        if (typeof tagItem !== 'undefined') {
            returnTags.push(tagItem);
        }
    });
    return returnTags;
}

/**
 * 根据 $ref 的 path 获取对应的 object
 * @param {string} path - $ref 的 字段，eg. #/definitions/User
 * @param {Object} sourceObject - 整段 swagger 对象
 * @return {Object}
 */
function getRefs(path, sourceObject) {
    const splitArr = path.split('/');
    if (splitArr.length === 0 || splitArr[0] !== '#') {
        return;
    }
    splitArr.shift();
    let refObjs = {};
    let refObj = sourceObject;

    try {
        splitArr.forEach(item => {
            refObj = refObj[item];
        });
    } catch (error) {
        console.log('error');
    }

    if (!!refObj) {
        refObjs[path] = refObj;
        const otherRefs = flattenRefs(refObj);
        if (otherRefs.length > 0) {
            otherRefs.forEach(item => {
                refObjs = Object.assign(refObjs, getRefs(item, sourceObject));
            });
        };
    }
    return refObjs;
}

/**
 * 抽离 swagger paths 里面的内容
 * @param {Object} paths swagger 文件中的 paths 字段，{'/pets': {...}, ...}
 * @param {string|Array} path 需要抽离接口的路径
 * @param {Object} options 需要抽离接口的 options
 * @return {Object}
 */
function stripInterface(paths, path, options) {
    if (!paths[path]) {
        return '';
    };
    let method = 'get';
    if (!!options && !!options.method) {
        method = options.method;
    }
    return paths[path][method];
}

/**
 * 抽离 Definitions 的内容，即 $ref 字段的内容
 * @param {Object|Array} node 被抽取的对象
 * @return {Array} eg. ['#/definitions/User', '#/definitions/xxx', ...]
 */
function flattenRefs(node) {
    let schemaArr = [];
    const isObject = Object.prototype.toString.call(node) === '[object Object]'
    && Object.keys(node).length > 0;

    if (isObject) {
        if (Object.keys(node).includes('$ref')) {
            schemaArr.push(node['$ref']);
        }
    } else if (!Array.isArray(node)) {
        return;
    }

    utils.each(node, item => {
        const ref = flattenRefs(item);
        if (Array.isArray(ref) && ref.length > 0) {
            schemaArr = schemaArr.concat(ref);
        }
    });

    return utils.dedupeArr(schemaArr);
}


// TODO: multiple files
function parseFiles(sourceFiles) {
    const parsedFiles = [];
    for (let i = 0, l = sourceFiles.length; i < l; i++) {
        let sourceCode = '';
        const filename = sourceFiles[i];
        try {
            sourceCode = fs.readFileSync(filename, { encoding: 'utf8' });
        }
        catch (err) {
            console.error('Unable to read and parse the source file %s: %s', filename, err);
        }
        if (sourceCode.length) {
            // parseSourceCode(sourceCode, filename);
            // parsedFiles.push(filename);
        }
    }
}