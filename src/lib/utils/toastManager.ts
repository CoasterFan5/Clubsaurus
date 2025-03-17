import toast from 'svelte-french-toast';
import type { CustomFormActionData } from './customFormActionData';

export const createPromiseToast = (loadingMessage: string) => {
	let toastPromiseResolve!: (reason: string | undefined) => void;
	let toastPromiseReject!: (reason: string | undefined) => void;

	const toastPromise = new Promise((resolve, reject) => {
		toastPromiseResolve = resolve;
		toastPromiseReject = reject;
	});

	console.log('toasting');
	toast.promise(toastPromise, {
		loading: loadingMessage,
		success: (message) => (message ? `${message}` : 'Success!'),
		error: (message) => (message ? `${message}` : 'Error occurred.')
	});

	return {
		resolve: toastPromiseResolve,
		reject: toastPromiseReject
	};
};

type PromiseToastActions = ReturnType<typeof createPromiseToast>;
export const handleToastPromiseWithFormAction = (
	formActionData: CustomFormActionData,
	toastActions: PromiseToastActions,
	options?: {
		redirectsAreSuccess?: boolean;
		redirectsAreFailure?: boolean;
		redirectMessage?: string;
		redirectOverride?: () => void;
	}
) => {
	switch (formActionData.type) {
		case 'success':
			toastActions.resolve(`${formActionData.data?.message}`);
			break;
		case 'failure':
			toastActions.reject(`${formActionData.data?.message}`);
			break;
		case 'error':
			toastActions.reject(`${formActionData.error?.message}`);
			break;
		case 'redirect':
			if (options?.redirectOverride) {
				options.redirectOverride();
			}
			if (options?.redirectsAreSuccess) {
				toastActions.resolve(options.redirectMessage);
			}
			if (options?.redirectsAreFailure) {
				toastActions.reject(options.redirectMessage);
			}
			break;
		default:
			break;
	}
	return;
};
