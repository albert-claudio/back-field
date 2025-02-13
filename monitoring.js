const promBundle = require('express-prom-bundle');

const metricsMiddleware = promBundle({
    includeMethod: true, //Inclui o método HTTP (GET, POST, etc)
    includePath: true, //Inclui o caminho da URL ("/api/videos", etc.)
    customLabels: { app: 'video-api'}, //Define um rótulo personalizado para a API
    promClient: {
        collectDefaultMetrics: {
            timeout: 1000 //Coleta métricas padrão do sistema a cada 1 segundo(como uso de CPU, mémorias e etc)
        }
    }
});

module.exports = { metricsMiddleware };