import { PutObjectCommand } from '@aws-sdk/client-s3';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { z } from 'zod';

import { bucket, mediaurl } from '$env/static/private';
import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { S3 } from '$lib/server/s3.js';
import { verifySession } from '$lib/server/verifySession';

const articleUrlRegex = /[^a-z0-9_-]+/gi;

export const load = async ({ cookies, params }) => {
	const user = await verifySession(cookies.get('session'));

	if (!user.siteAdmin) {
		throw redirect(303, '/blog');
	}

	const article = await prisma.blogArticle.findFirst({
		where: {
			articleURL: params.article
		},
		include: {
			images: true
		},
		orderBy: {
			id: 'asc'
		}
	});

	if (!article) {
		throw redirect(303, '/blog/edit');
	}

	const unselectedTags = await prisma.blogTagTemplate.findMany({
		where: {
			assignments: {
				none: {
					blogId: article.id
				}
			}
		}
	});

	const selectedTags = await prisma.assignedBlogTag.findMany({
		where: {
			blogId: article.id
		},
		include: {
			tag: true
		}
	});

	return {
		article,
		unselectedTags,
		selectedTags
	};
};

export const actions = {
	saveDetails: formHandler(
		z.object({
			name: z.string(),
			image: z.string().optional(),
			published: z.coerce.boolean(),
			description: z.string().optional()
		}),
		async ({ name, image, description, published }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			if (!user.siteAdmin) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const article = await prisma.blogArticle.findFirst({
				where: {
					articleURL: params.article
				}
			});

			if (!article) {
				return {
					success: false,
					message: 'How did we get here?'
				};
			}

			const newUrl = name.replace(articleUrlRegex, '-').toLowerCase();

			await prisma.blogArticle.update({
				where: {
					id: article?.id
				},
				data: {
					articleName: name,
					articleURL: newUrl,
					articleImage: image,
					published,
					articleDescription: description || 'No article description :('
				}
			});

			throw redirect(303, `/blog/edit/${newUrl}`);
		}
	),
	save: formHandler(
		z.object({
			content: z.string()
		}),
		async ({ content }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			if (!user.siteAdmin) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const article = await prisma.blogArticle.findFirst({
				where: {
					articleURL: params.article
				}
			});

			if (!article) {
				return {
					success: false,
					message: 'How did we get here?'
				};
			}

			await prisma.blogArticle.update({
				where: {
					id: article.id
				},
				data: {
					articleText: content
				}
			});

			return {
				success: true,
				message: 'Article Updated!'
			};
		}
	),
	uploadImage: async ({ cookies, request, params }) => {
		const user = await verifySession(cookies.get('session'));

		const formData = Object.fromEntries(await request.formData());

		if (!user.siteAdmin) {
			return fail(400, {
				success: false,
				message: 'Invalid Permissions'
			});
		}

		if (!formData.image) {
			return {
				success: false,
				message: 'No image?'
			};
		}

		const article = await prisma.blogArticle.findFirst({
			where: {
				articleURL: params.article
			}
		});

		if (!article) {
			return fail(400, {
				success: false,
				message: 'No article'
			});
		}

		const file: File = formData.image as File;

		if (!file) {
			return fail(400, {
				success: false,
				message: 'Error parsing file.'
			});
		}
		const fileBuffer = await file.arrayBuffer();

		let fileName = file.name;
		if (fileName.length > 32) {
			fileName = fileName.substring(fileName.length - 32);
		}

		const randomId = crypto.randomBytes(32).toString('base64url');
		const key = `images/${randomId}/${fileName}`;

		await S3.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: new Uint8Array(fileBuffer)
			})
		);

		await prisma.blogImage.create({
			data: {
				blogId: article.id,
				key: `${mediaurl}/${key}`
			}
		});

		return {
			success: true,
			message: 'Image uploaded'
		};
	},
	addTag: formHandler(
		z.object({
			tagName: z.string()
		}),
		async ({ tagName }, { cookies }) => {
			const user = await verifySession(cookies.get('session'));

			if (!user.siteAdmin) {
				return fail(400, {
					success: false,
					message: 'Invalid Permissions'
				});
			}

			const realTagName = tagName.toLowerCase().trim();

			await prisma.blogTagTemplate.upsert({
				where: {
					tagName: realTagName
				},
				update: {},
				create: {
					tagName: realTagName
				}
			});
		}
	),
	addTagToArticle: formHandler(
		z.object({
			id: z.coerce.number()
		}),
		async ({ id }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const article = await prisma.blogArticle.findFirst({
				where: {
					articleURL: params.article
				}
			});

			if (!article) {
				return fail(400, {
					success: false,
					message: 'No article'
				});
			}

			if (!user.siteAdmin) {
				return fail(400, {
					success: false,
					message: 'Invalid Permissions'
				});
			}

			await prisma.assignedBlogTag.create({
				data: {
					blogId: article.id,
					tagId: id
				}
			});
		}
	),
	removeTagFromArticle: formHandler(
		z.object({
			id: z.coerce.number()
		}),
		async ({ id }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const article = await prisma.blogArticle.findFirst({
				where: {
					articleURL: params.article
				}
			});

			if (!article) {
				return fail(400, {
					success: false,
					message: 'No article'
				});
			}

			if (!user.siteAdmin) {
				return fail(400, {
					success: false,
					message: 'Invalid Permissions'
				});
			}

			await prisma.assignedBlogTag.delete({
				where: {
					id
				}
			});
		}
	)
};
