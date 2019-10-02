import Base from '@dojo/framework/core/meta/Base';

type Valid = { [key: string]: Validity };
type Validity = boolean | { valid?: boolean; message?: string };
type Required = { [key: string]: boolean };

export interface Field<S, K extends keyof S> {
	value: {
		(newValue: S[K]): S[K];
		(): S[K] | undefined;
	};
  valid(valid?: boolean, message?: string): Validity;
	required(required?: boolean): boolean;
}

export default class Form<S extends { [key: string]: any } = any> extends Base {
	private _initial: Partial<S> = {};
	private _values: Partial<S> = {};
	private _valid: Valid = {};
	private _required: Required = {};

	initialize(initial: Partial<S>) {
		this._initial = initial;
		this.invalidate();
	}

	value(): Partial<S>;
	value(defaults: S): S;
	value(defaults?: S): any {
		if (defaults) {
			return { ...defaults, ...this._values } as S;
		}
		return this._values;
	}

	submit<T = void>(callback: (values: Partial<S>) => T): T;
	submit<T = void>(callback: (values: S) => T, defaults: S): T;
	submit<T = void>(callback: (values: any) => T, defaults?: S) {
		if (!this.valid()) {
			return;
		}
		if (defaults) {
			return callback(this.value(defaults));
		}
		return callback(this.value());
	}

	valid() {
		return Object.keys(this._valid).every((key) => {
			const valid = this._valid[key];
			const value = typeof valid === 'boolean' ? valid : valid.valid;
			return (value === undefined && !this._required[key]) || Boolean(value);
		});
	}

	reset() {
		this._values = this._initial || {};
		let valid: Valid = {};
		Object.keys(this._valid).map((key) => {
			valid[key] = { valid: undefined, message: '' };
		});
		this._valid = valid;
		this._required = {};
		this.invalidate();
	}

	field<K extends keyof S>(name: K, required = false): Field<S, K> {
		if (this._required[name as string] === undefined) {
			this._required = {
				...this._required,
				[name]: required
			};
		}
		return {
			value: (newValue?: any): any => {
				if (newValue !== undefined && this._values[name] !== newValue) {
					this._values = { ...this._values, [name]: newValue };
					this.invalidate();
					return newValue;
				}

				return this._values[name];
			},
			valid: (valid?: boolean, message?: string): Validity => {
				if (
					!this._valid.hasOwnProperty(name) ||
					(valid !== undefined && this._valid[name as string] !== valid)
				) {
					const value = valid || {
						valid,
						message: message || ''
					};
					this._valid = {
						...this._valid,
						[name]: value
					};
					this.invalidate();
					return value;
				}
				return this._valid[name as string];
			},
			required: (required?: boolean) => {
				if (required !== undefined) {
					this._required = {
						...this._required,
						[name]: required
					};
					this.invalidate();
					return required;
				}
				return Boolean(this._required[name as string]);
			}
		};
	}
}
