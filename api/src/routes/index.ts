import { Router } from 'express';
import { body } from 'express-validator';
import swaggerUi from 'swagger-ui-express';

import v1 from './v1';
import v2 from './v2';
import v3 from './v3';
import login from './login';
import users from './users';
import cleanup from './cleanup';

import { Validation } from './Validation';
import { Authentication } from './Authentication';

import swaggerFile from '../docs/swagger.json';

const router = Router();

/**
 * Authentication
 */
router.get('/v*/balance', Authentication);
router.post('/v*/transactions', Authentication);

/**
 * Body Validation
 */
router.post(
  '/users',
  [body('email').isEmail(), body('password').isString(), body('name').isString()],
  Validation,
);

router.post('/login', [body('email').isEmail(), body('password').isString()], Validation);

router.post(
  '/v*/transactions',
  [body('description').isString().default(''), body('value').isNumeric()],
  Validation,
);

router.get('/v*/balance', Authentication);

/**
 * Routes Implementation
 */
router.use(login);
router.use(users);
router.use(cleanup);
router.use('/v1', v1);
router.use('/v2', v2);
router.use('/v3', v3);

/**
 * Docs
 */
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default router;
