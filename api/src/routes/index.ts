import { Router } from 'express';
import { body } from 'express-validator';

import v1 from './v1';
import v2 from './v2';
import v3 from './v3';
import { Validation } from './Validation';
import { Authentication } from './Authentication';

const router = Router();

router.post(
  '/v*/users',
  [body('email').isEmail(), body('password').isString(), body('name').isString()],
  Validation,
);

router.post('/v*/login', [body('email').isEmail(), body('password').isString()], Validation);

router.post(
  '/v*/transactions',
  Authentication,
  [body('description').isString().default(''), body('value').isNumeric()],
  Validation,
);

router.get('/v*/balance', Authentication);

router.use('/v1', v1);
router.use('/v2', v2);
router.use('/v3', v3);

export default router;
