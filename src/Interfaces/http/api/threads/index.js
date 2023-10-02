const ThareadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'threads',
    register: async (server, { container }) => {
        const thareadHandler = new ThareadHandler(container);
        server.route(routes(thareadHandler));
    },
};
