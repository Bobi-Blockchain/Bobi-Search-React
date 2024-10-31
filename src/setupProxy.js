const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/database",
        createProxyMiddleware({
            target: "http://localhost:3001",
            changeOrigin: true,
            pathRewrite: {
                "^/database": "",
            },
        })
    );
    app.use(
        "/braveapi",
        createProxyMiddleware({
            target: "https://api.search.brave.com",
            changeOrigin: true,
            pathRewrite: {
                "^/braveapi": "",
            },
        })
    );
};