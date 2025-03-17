import crypto from 'crypto';

export const hashPassword = ({ password, salt }: { password: string; salt?: string }) => {
	if (!salt) {
		salt = crypto.randomBytes(128).toString('base64url');
	}

	const hash = crypto.pbkdf2Sync(password, salt, 1000, 128, 'SHA512').toString('base64url');

	return {
		salt,
		hash
	};
};
