import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

import StudentController from './app/controllers/StudentController';
import ListStudentsWithoutRegistration from './app/controllers/ListStudentsWithoutRegistration';

import PlanController from './app/controllers/PlanController';
import GetOnePlan from './app/controllers/GetOnePlan';

import RegistrationController from './app/controllers/RegistrationController';
import GetOneRegistration from './app/controllers/GetOneRegistration';

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

routes.get('/registration/:registration_id', GetOneRegistration.index);

// Auth Middleware
routes.use(authMiddleware);

// Students Routes
routes.get('/students', StudentController.index);
routes.get('/students/registrations', ListStudentsWithoutRegistration.index);
routes.post('/students', StudentController.store);
routes.put('/student/:student_id', StudentController.update);
routes.delete('/student/:student_id', StudentController.delete);

// Plans Routes
routes.get('/plans', PlanController.index);
routes.get('/plan/:plan_id', GetOnePlan.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plan/:plan_id', PlanController.delete);

// Registration Routes
routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration/:registration_id', RegistrationController.update);
routes.delete('/registration/:registration_id', RegistrationController.delete);

// Answer Orders Routes
routes.get('/help-orders', AnswerOrdersController.index);
routes.post('/help-orders/:help_id', AnswerOrdersController.store);

export default routes;
