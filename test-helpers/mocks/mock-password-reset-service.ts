import { fn } from 'jest-mock';

import type User from '#models/user';
import PasswordResetService from '#services/password-reset-service';

export default class MockPasswordResetService extends PasswordResetService {
	generateToken = fn((user: User | null) => super.generateToken(user));
	clearPreviousToken = fn((user: User) => super.clearPreviousToken(user));
	getUserByToken = fn((token: string) => super.getUserByToken(token));
	verifyToken = fn((token: string) => super.verifyToken(token));
}
