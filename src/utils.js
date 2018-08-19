/**
 * @file utils
 * @author 陈蔓青 <chenmanqing@baidu.com>
 * @created time: 2018-08-19 13:51:02
 */

module.exports = {
    each(data, cb) {
        if (Array.isArray(data)) {
            data.forEach((val, i, all) => cb(val, i, i, all));
        } else {
            Object.keys(data).forEach((key, i) => cb(data[key], key, i, data));
        }
    },
    // 数组去重
    dedupeArr(array) {
        return Array.from(new Set(array));
    },

    hasOwnProp(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }
};
