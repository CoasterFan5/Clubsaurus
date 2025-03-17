import { fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
import type { ZodObject, ZodRawShape } from 'zod';

export function actionHelper<Shape extends ZodRawShape, Z extends ZodObject<Shape>, R>(
	formSchema: Z,
	runnable: (data: Z['_output'], event: RequestEvent) => Promise<R>
): (event: RequestEvent) => Promise<R | ActionFailure<{ success: boolean; message: string }>> {
	return async (event: RequestEvent) => {
		const formData = await event.request.formData();

		const obj = Object.fromEntries(formData.entries());

		const parsed = formSchema.strict().safeParse(obj);

		if (!parsed.success) {
			let errorMessage = 'Invalid Data';
			//attempt to get the first error message
			if (parsed.error.errors.length > 0) {
				errorMessage = parsed.error.errors[0].message || 'Invalid Data';
			}
			console.error(parsed.error);
			return fail(400, {
				success: false,
				message: errorMessage
			});
		}
		return await runnable(parsed.data, event);
	};
}
