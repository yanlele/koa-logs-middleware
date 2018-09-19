const moment = require('moment');

const index = {
    // 时间常量
    time: {
        now: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        month: moment(new Date()).format('YYY-MM')
    },
    // 日志类型
    logTypeList: [
        {
            'type': 'info',
            'color': 'cyan',
            'icon': '>'
        },
        {
            'type': 'error',
            'color': 'red',
            'icon': '✗'
        },
        {
            'type': 'success',
            'color': 'green',
            'icon': '✔'
        },
        {
            'type': 'trace',
            'color': 'dim',
            'icon': '*'
        },
        {
            'type': 'debug',
            'color': 'blue',
            'icon': '*'
        },
        {
            'type': 'warn',
            'color': 'yellow',
            'icon': '!'
        },
        {
            'type': 'fatal',
            'color': 'bgRed',
            'icon': '✗'
        }
    ]
};
module.exports = index;
