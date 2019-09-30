import { create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

type Valid = { [key: string]: Validity };
type Validity = boolean | { valid?: boolean; message?: string };
type Required = { [key: string]: boolean };

interface FormMiddleware<S> {
	value: {
		(): Partial<S>;
		(defaults: S): S;
	};
	submit: {
		(callback: (values: Partial<S>) => void): void;
		(callback: (values: S) => void, defaults: S): void;
	};
	valid(): boolean;
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

export const createFormMiddleware = <S extends { [key: string]: any }>(initial?: Partial<S>) => {
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
			submit(callback: (values: any) => void, defaults?: S) {
				if (!this.valid()) {
					return;
				}
				if (defaults) {
          callback(this.value(defaults));
        }
				callback(this.value());
			},
			valid() {
				const values = icache.get<Valid>('valid') || {};
				const requiredValues = icache.get<Required>('required') || {};
        console.log(values, requiredValues);
				Object.keys(values).forEach((key) => {
          const valid = values[key];
          const value = typeof valid === 'boolean' ? valid : valid.valid;
          console.log(key, value, requiredValues[key], value === undefined && !requiredValues[key] || Boolean(value));
        });
				return Object.keys(values).every((key) => {
          const valid = values[key];
          const value = typeof valid === 'boolean' ? valid : valid.valid;
          return (value === undefined && !requiredValues[key]) || Boolean(value);
				});
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
					value: (newValue?: S[K]) => {
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
						return values[name as string];
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
				};
			}
		};
	});
	return formMiddleware;
};

export default createFormMiddleware;
