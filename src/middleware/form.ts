import { create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

type Valid = Record<string, Validity>;
export type Validity = boolean | { valid?: boolean; message?: string };
type Required = Record<string, boolean>;

interface FormMiddleware<S> {
	value: {
		(): Partial<S>;
		(defaults: S): S;
	};
	submit: {
		<T = void>(callback: (values: Partial<S>) => T): T;
		<T = void>(callback: (values: S) => T, defaults: S): T;
	};
	valid(): boolean;
	reset(): void;
	field<K extends keyof S>(name: K, required?: boolean): Field<S, K>;
}

export interface Field<S, K extends keyof S> {
	value: {
		(newValue: S[K]): S[K];
		(): S[K] | undefined;
	};
  valid(valid?: boolean, message?: string): Validity;
	required(required?: boolean): boolean;
}

export const createFormMiddleware = <S extends Record<string, any> = any>(initial?: Partial<S>) => {
	const formMiddleware = factory(function Form({ middleware: { icache } }): FormMiddleware<S> {
		if (initial) {
			icache.set('values', initial);
		}
		return {
			value(defaults?: S): any {
				const values = icache.getOrSet<Partial<S>>('values', {});
				if (defaults) {
					return { ...defaults, ...values } as S;
				}
				return values;
			},
			submit<T = void>(callback: (values: any) => T, defaults?: S) {
				if (!this.valid()) {
					return;
				}
				if (defaults) {
					return callback(this.value(defaults));
        }
				return callback(this.value());
			},
			valid() {
				const values = icache.get<Valid>('valid') || {};
				const requiredValues = icache.get<Required>('required') || {};
				return Object.keys(values).every((key) => {
          const valid = values[key];
          const value = typeof valid === 'boolean' ? valid : valid.valid;
          return (value === undefined && !requiredValues[key]) || Boolean(value);
				});
			},
			reset() {
				icache.set('values', initial || {});
				let valid: Valid = {};
				const values = icache.get<Valid>('valid') || {};
				Object.keys(values).map((key) => {
					valid[key] = { valid: undefined, message: '' };
				});
				icache.set('valid', valid);
				icache.set('required', {});
			},
			field<K extends keyof S>(name: K, required = false): Field<S, K> {
        const requiredValues = icache.getOrSet<Required>('required', {});
        if (requiredValues[name as string] === undefined) {
          icache.set('required', {
            ...requiredValues,
            [name]: required
          });
        }
				return {
					value: (newValue?: any): any => {
						const values = icache.getOrSet('values', {}) as S;
						if (newValue !== undefined && values[name] !== newValue) {
							icache.set('values', { ...values, [name]: newValue });
							return newValue;
						}

						return values[name];
					},
					valid: (valid?: boolean, message?: string): Validity => {
						const values = icache.getOrSet<Valid>('valid', {});
						if (
							!values.hasOwnProperty(name) ||
							(valid !== undefined && values[name as string] !== valid)
						) {
							const value = valid || {
								valid,
								message: message || ''
							};
							icache.set('valid', {
								...values,
								[name]: value
							});
							return value;
						}
						return Boolean(values[name as string]);
          },
          required: (required?: boolean) => {
            const values = icache.getOrSet<Required>('required', {});
            if (required !== undefined) {
              icache.set('required', {
                ...values,
                [name]: required
              });
              return required;
            }
            return Boolean(values[name as string]);
          }
				} as Field<S, K>;
			}
		};
	});
	return formMiddleware;
};

export default createFormMiddleware;
