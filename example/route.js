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
    ctx.logger.debug('test');
    ctx.body = 'test';
});

router.post('/test/', (ctx) => {
    const requestBody = ctx.request.body;
    ctx.logger.debug(JSON.stringify(requestBody));
    let returnMsg = Object.assign(requestBody, {
        add: 'add message'
    });
    ctx.logger.debug(JSON.stringify(returnMsg));
    ctx.body = returnMsg;
});

module.exports = router;