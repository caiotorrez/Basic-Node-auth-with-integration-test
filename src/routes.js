const routes = require('express').Router();
const SessionController = require('./controllers/session.controller');
const authMiddleware = require('./middleware/auth');

routes.post('/session', SessionController.store);
routes.use(authMiddleware);
routes.get('/dashboard', (req, res) => {
    return res.status(200).send();
});

module.exports = routes;