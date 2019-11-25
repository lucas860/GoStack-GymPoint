import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import getOneStudent from './app/controllers/getOneStudent';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import AnswerOrdersController from './app/controllers/AnswerOrdersController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Session Routes
routes.post('/session', SessionController.store);

// Checkin Routes
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

// Help Orders Routes
routes.get('/students/:student_id/help-orders', HelpOrdersController.index);
routes.post('/students/:student_id/help-orders', HelpOrdersController.store);

// Auth Middleware
routes.use(authMiddleware);

// Students Routes
routes.get('/students', StudentController.index);
routes.get('/student/:student_id', getOneStudent.index);
routes.post('/students', StudentController.store);
routes.put('/student/:student_id', StudentController.update);
routes.delete('/student/:student_id', StudentController.delete);

// Plans Routes
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

// Registration Routes
routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/:registration_id', RegistrationController.update);
routes.delete('/registration/:registration_id', RegistrationController.delete);

// Answer Orders Routes
routes.get('/help-orders', AnswerOrdersController.index);
routes.post('/help-orders/:help_id/answer', AnswerOrdersController.store);

export default routes;
