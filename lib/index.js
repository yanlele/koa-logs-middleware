const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const safeStringify = require('fast-safe-stringify');
const {time, logTypeList} = require('../utils/const');
const {reqSerializer, resSerializer} = require('../utils/index');

const {now, month} = time;

/**
 * 写入日志
 * @param options
 */
function writeLogFile(options) {
    let filePath = path.resolve(options.defaultPath, options.applicationName + '_' + month + '_' + options.type + '.log');
    fs.outputFile(filePath, options.writeMessage, {
        'flag': 'a'
    }).catch(function(err) {
        throw new Error('写入文件失败')
    })
}


/**
 * 自动拉取请求信息，重新封装日志信息
 * @param ctx
 * @param options
 * @param args
 * @returns {{appName: (*|string), message: *, req: *}}
 */
function autoReq(ctx, options, args) {
    return {
        appName: options.applicationName,
        message: args,
        req: reqSerializer(ctx)
    }
}

/**
 * auto 自动记录日志项, 在请求finish出发，可以拿到res信息
 * @param ctx
 * @param options
 * @returns {{appName: (*|string), req: *, res: *}}
 */
function autoInfo (ctx, options) {
    return {
        appName: options.applicationName,
        req: reqSerializer(ctx),
        res: resSerializer(ctx),
    }
}

/**
 * 如果错误的情况自动记录错误日志
 * @param ctx
 * @param options
 * @param err
 */
function autoError(ctx, options, err) {
    Object.assign(autoInfo(ctx, options), {
        err: {
            type: err.constructor.name,
            message: err.message,
            stack: err.stack
        },
    });
    autoInfo(ctx, options)
}

/**
 * 封装日志核心
 */
function factoryLog(outputStream, ctx, options) {
    let logger = {};                // storage warehouse
    logTypeList.forEach(function (logType) {
        logger[logType.type] = function () {
            // 获取入参参数
            let args = Array.prototype.slice.call(arguments, 0);
            if(args.length > 1) {
                args = args.join(' ');
            } else {
                args = args[0];
            }
            // 写入数据字符串
            let writeMessage = `[${now} - ${logType.type}] ${args}` + '\n';
            // 拼接 icon
            if (logType.icon) args = [logType.icon].concat(args);
            // 输出到控制条字符串
            let message = `[${now} - ${logType.type}] ${chalk[logType.color].apply(global.console, args)}`;
            // 输出到控制台逻辑部分
            global.console.log(message);
            // 写入日志流程
            if (logType.type === 'info' || logType.type === 'error' || logType.type === 'fatal') {
                // 如果是这三种情况的日志，就需要输入 到日志文件夹
                outputStream.then(() => {
                    fs.ensureDir(options.defaultPath)
                        .then(function () {
                            writeLogFile(Object.assign(options, {type: logType.type, writeMessage}));
                        })
                        .catch(function(err) {
                            throw new Error('your folder does not exist, create your folder first.');
                        })
                });
            }
        };
    });

    return logger;
}


/**
 * 日志核心类
 * @param options
 * @returns {log} 必须要包含 defaultPath 和 applicationName
 * @constructor
 */
function KoaLog(options) {
    let defaultOptions = {
        defaultPath: '',
        auto: false
    };

    // get package.json name
    try {
        const pkg = require('./package.json');
        if(pkg && pkg.name) {
            defaultOptions.applicationName = pkg.name;
        }
    } catch(e) {
        defaultOptions.applicationName = ''
    }
    options = Object.assign(defaultOptions, options);
    // 判定是否写入日志文件
    const outputStream =  new Promise((resolve, reject) => {
        if (options.defaultPath) {
            resolve()
        }
    });



    /**
     * 异步抛出日志，绑定到 koa ctx 上面
     * @param ctx
     * @param next
     * @returns {*|Promise<T>}
     */
    function log(ctx, next) {

        const logger = factoryLog(outputStream, ctx, options);
        ctx.logger = ctx.log = logger;
        // 在finish 拿到监听，可以做
        ctx.res.on('finish', function(e) {
            if(e) {
                logger.error(safeStringify(autoError(ctx, options, e)));
            } else {
                if(options.auto) {
                    logger.info(safeStringify(autoInfo(ctx, options)));
                }
            }
        });
        return next().catch(function (e) {
            ctx.log.error(safeStringify({
                err: {
                    type: e.constructor.name,
                    message: e.message,
                    stack: e.stack
                },
                responseTime: ctx.res.responseTime
            }));
            throw e
        })
    }
    return log;
}

module.exports = KoaLog;