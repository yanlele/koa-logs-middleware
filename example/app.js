const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routing = require('./route');
const logger = require('../lib/index');

// 解析body
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));

// 加载日志
app.use(logger({
    defaultPath: path.resolve(__dirname, 'logs'),
    applicationName: 'app'
}));

// 开发输入日志
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 初始化路由中间件
app.use(routing.routes()).use(routing.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
    ctx.logger.error('server error', err, ctx)
});


const app = new Koa();