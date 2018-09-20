const tool = {
    arrayToString(arr) {
        return arr.join(' ');
    },
    reqSerializer(ctx) {               // 拿到req的一些列信息
        return {
            url: ctx.url,
            headers: ctx.request.header,
            method: ctx.method,
            ip: ctx.ip,
            protocol: ctx.protocol,
            originalUrl: ctx.originalUrl,
            request: ctx.request.body ,
            query: ctx.query
        };
    },
    resSerializer(ctx) {               // 拿到res 的参数
        return {
            statusCode: ctx.status,
            responseTime: ctx.responseTime,
            headers: ctx.response.header,
            response: ctx.response.body
        };
    }
};


module.exports = tool;