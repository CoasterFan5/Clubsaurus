import type { ActionResult } from '@sveltejs/kit';

export type CustomFormActionData = ActionResult<
	Record<string, unknown> | undefined,
	Record<string, unknown> | undefined
>;
