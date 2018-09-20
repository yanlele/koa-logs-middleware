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
 * @param args
 * @returns {{appName: (*|string), req: *, res: *}}
 */
function autoInfo (ctx, options, args) {
    let returnData = autoReq(ctx, options, args);
    returnData.res = resSerializer(ctx);
    return returnData;
}

/**
 * 如果错误的情况自动记录错误日志
 * @param ctx
 * @param options
 * @param err
 * @param args
 * @returns {{appName: (*|string), message: *, req: *} & {err: {type: *, message: *, stack: *}}}
 */
function autoError(ctx, options, err, args) {
    return Object.assign(autoReq(ctx, options, args), {
        err: {
            type: err.constructor.name,
            message: err.message,
            stack: err.stack
        },
    });
}

function createLog(opts) {
    let autoFunc = autoInfo(opts.ctx,opts.options, 'auto');
    let color = 'cyan';
    if(opts.type === 'err') {
        autoFunc = autoError(opts.ctx, opts.options, opts.err, 'auto');
        color = 'red';
    }
    // 重组输出数据
    let rebuildLogMessage = safeStringify(autoFunc);
    // 写入数据字符串
    let writeMessage = `[${now} - ${opts.type} - auto] ${rebuildLogMessage}` + '\n';
    // 输出到控制条字符串
    let message = `[${now} - ${opts.type} - auto] ${chalk[color](rebuildLogMessage)}`;
    // 输出到控制台逻辑部分
    global.console.log(message);
    // 写入日志流程
    if (opts.type === 'info' || opts.type === 'error' || opts.type === 'fatal') {
        // 如果是这三种情况的日志，就需要输入 到日志文件夹
        opts.outputStream.then(() => {
            fs.ensureDir(opts.options.defaultPath)
                .then(function () {
                    writeLogFile(Object.assign(opts.options, {type: opts.type, writeMessage}));
                })
                .catch(function(err) {
                    throw new Error('your folder does not exist, create your folder first.');
                })
        });
    }
}

/**
 * 封装日志核心
 * @param outputStream
 * @param ctx
 * @param options
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

            // 重组输出数据
            let rebuildLogMessage = safeStringify(autoReq(ctx,options,args));

            // 写入数据字符串
            let writeMessage = `[${now} - ${logType.type}] ${rebuildLogMessage}` + '\n';
            // 拼接 icon
            if (logType.icon) rebuildLogMessage = [logType.icon].concat(rebuildLogMessage);
            // 输出到控制条字符串
            let message = `[${now} - ${logType.type}] ${chalk[logType.color].apply(global.console, rebuildLogMessage)}`;
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
                createLog({
                    ctx,
                    options,
                    err: e,
                    type: 'error',
                    outputStream
                })
            } else {
                if(options.auto) {
                    createLog({
                        ctx,
                        options,
                        type: 'info',
                        outputStream
                    })
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