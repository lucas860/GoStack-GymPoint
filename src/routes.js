import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';

import authMiddleware from './middlewares/auth';

const routes = new Router();

// Session Routes
routes.post('/session', SessionController.store);

// Auth Middleware
routes.use(authMiddleware);

// Students Routes
routes.post('/students', StudentController.store);

// Plans Routes
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

// Registration Routes
routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);

export default routes;
