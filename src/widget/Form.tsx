import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';

import createFormMiddleware, { Validity } from '../middleware/form';

const form = createFormMiddleware();

interface FormProperties {
	onSubmit(values: any): void;
	renderer(options: {
		values: <S extends Record<string, any> = any>(values?: Partial<S>) => ({
			set<K extends keyof S>(key: K, value: S[K]): S[K],
			get<K extends keyof S>(key: K): S[K] | undefined
		}),
		required: (key: string, required?: boolean) => boolean
		valid: {
			(): boolean,
			(key: string): Validity
			(key: string, valid?: boolean, message?: string): Validity
		},
		disabled: {
			(): boolean,
			(disabled: boolean): boolean,
			(key: string): boolean
			(key: string, disabled: boolean): boolean
		},
		form: ReturnType<typeof form>['api']
	}): RenderResult;
}
const factory = create({ form }).properties<FormProperties>();

export default factory(function Form({ properties, middleware: { form } }) {
	const { onSubmit, renderer } = properties();

	const values = (values?: any) => {
		form.value(values);
		return {
			get: (key: string | number | symbol) => {
				const field = form.field(key);
				return field.value();
			},
			set: (key: string | number | symbol, value?: any) => {
				const field = form.field(key);
				return field.value(value);
			}
		};
};

	const required = (key: string | number | symbol, required?: boolean) => {
		const field = form.field(key);
		return field.required(required);
	};

	const valid = (key?: string, valid?: boolean, message?: string): any => {
		if (key) {
			const field = form.field(key);
			return field.valid(valid, message);
		}
		return form.valid();
	}

	const disabled = (keyOrDisabled?: string | boolean, disabled?: boolean) => {
		if (keyOrDisabled === undefined || typeof keyOrDisabled === 'boolean') {
			return form.disabled(keyOrDisabled);
		}
		const field = form.field(keyOrDisabled);
		return field.disabled(disabled);
	}

	return (
		<form onsubmit={(event) => {
			event.preventDefault();
			form.submit(onSubmit)
		}}>
			{renderer({ values, required, valid, form, disabled })}
		</form>
	);
});
