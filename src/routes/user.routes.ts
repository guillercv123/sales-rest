import { Router } from 'express';
import { getUsers, createUser, updatePasswordUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.post('/reset-password', updatePasswordUser);
export default router;
