const router = require('koa-router')();

router.get('/home', (ctx) => {
    const returnObject = {
        name: 'yanle',
        age: 35
    };
    // ctx.logger.debug('request Param: ',JSON.stringify(ctx.query));
    // ctx.logger.debug('response: ', JSON.stringify(returnObject));
    ctx.logger.info('koa-logs-middleware');
    ctx.logger.error('koa-logs-middleware');
    ctx.logger.success('koa-logs-middleware');
    ctx.logger.trace('koa-logs-middleware');
    ctx.logger.debug('koa-logs-middleware');
    ctx.logger.warn('koa-logs-middleware');
    ctx.logger.fatal('koa-logs-middleware');
    ctx.body = returnObject;
});

router.get('/test/', (ctx) => {
    ctx.logger.debug('test');
    ctx.body = 'test';
});

module.exports = router;