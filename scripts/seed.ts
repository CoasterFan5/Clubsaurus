import { PrismaClient } from '@prisma/client';
import { promisify } from 'util';
import crypto from 'crypto';

const pkdf2 = promisify(crypto.pbkdf2);

const prisma = new PrismaClient();

interface PasswordData {
	hash: string;
	salt: string;
}

async function makePassword(password: string): Promise<PasswordData> {
	const salt = crypto.randomBytes(32).toString('hex');
	const hash = (await pkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

	return { hash, salt };
}

async function main() {
	const org = await prisma.organization.findFirst({ where: { id: 1 } });

	if (org && org.name != 'Cardboard') {
		throw new Error(
			'Organization with id 1 already exists and is not Cardboard. Are you sure this is the right database?'
		);
	}

	console.log('Seeding database...');

	await prisma.organization.upsert({
		where: { id: 1, name: 'Cardboard' },
		update: {},
		create: {
			name: 'Cardboard',
			joinCode: '123456',
			owner: {
				create: {
					firstName: 'Card',
					lastName: 'Board',
					email: 'leader@card.board',
					...(await makePassword('password'))
				}
			},
			orgUsers: {
				create: {
					role: 'ADMIN',
					user: {
						create: {
							firstName: 'Brick',
							lastName: 'Stone',
							email: 'bstone@card.board',
							...(await makePassword('password')),
							clubs: {
								create: [
									{
										name: 'Cardboard Club',
										organization: {
											connect: {
												id: 1
											}
										},
										imageURL:
											'https://static01.nyt.com/images/2022/12/04/magazine/04mag-cardboard-copy/04mag-cardboard-copy-facebookJumbo-v2.jpg'
									},
									{
										name: 'Board Game Club',
										organization: {
											connect: {
												id: 1
											}
										},
										imageURL: 'https://media.timeout.com/images/105627949/750/422/image.jpg'
									},
									{
										name: 'Math Club',
										organization: {
											connect: {
												id: 1
											}
										},
										imageURL:
											'https://www.the74million.org/wp-content/uploads/2023/02/iStock-470493341-copy.jpg'
									},
									{
										name: 'Football Club',
										organization: {
											connect: {
												id: 1
											}
										},
										imageURL:
											'https://daily.jstor.org/wp-content/uploads/2018/06/soccer_europe_1050x700.jpg'
									}
								]
							}
						}
					}
				}
			}
		}
	});

	console.log('Database seeded!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
