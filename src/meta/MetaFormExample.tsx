import { tsx } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';

import TextInput from '@dojo/widgets/text-input';
import Button from '@dojo/widgets/button';

import Form from './Form';

interface Fields {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
}

export default class MetaFormExample extends WidgetBase {
	private _results: Fields | undefined;

	render() {
		const form = this.meta(Form) as Form<Fields>;

		const firstName = form.field('firstName', true);
		const middleName = form.field('middleName');
		const lastName = form.field('lastName', true);
		const email = form.field('email');
	
		const onSubmit = () => form.submit((values) => {
			this._results = values;
			this.invalidate();
		}, {
			firstName: '',
			lastName: ''
		});
	
		const toggleRequired = () => middleName.required(!middleName.required());
	
		return (
			<div>
				<form>
					<TextInput
						label="First Name"
						placeholder="Enter first name (must be Daniel)"
						pattern="Daniel"
						required={true}
						value={firstName.value()}
						onInput={val => firstName.value(String(val))}
						onValidate={firstName.valid}
					/>
					<TextInput
						label="Middle Name"
						placeholder="Enter a middle name"
						required={middleName.required()}
						value={middleName.value()}
						onInput={val => middleName.value(String(val))}
						onValidate={middleName.valid}
						maxLength={5}
					/>
					<TextInput
						label="Last Name"
						placeholder="Enter a last name"
						required={true}
						value={lastName.value()}
						onInput={val => lastName.value(String(val))}
						onValidate={lastName.valid}
						minLength={2}
					/>
					<TextInput
						label="Email"
						placeholder="Enter an email address"
						required={email.required()}
						value={email.value()}
						onInput={val => email.value(String(val))}
						onValidate={email.valid}
						type="email"
						pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
					/>
					<Button
						type="button"
						onClick={() => {
							firstName.value('Daniel');
							middleName.value('');
							lastName.value('Lautzenheiser');
						}}>
						Fill
					</Button>
					<Button type="button" onClick={toggleRequired}>
						{`Make middle name ${middleName.required() ? 'optional' : 'required'}`}
					</Button>
					<Button type="button" onClick={() => form.reset()}>Reset</Button>
					<Button type="button" disabled={!form.valid()} onClick={onSubmit}>
						Submit
					</Button>
				</form>
				{this._results && (
					<div>
						<h2>Results</h2>
						<ul>
							<li>First Name: {this._results.firstName}</li>
							<li>Middle Name: {this._results.middleName}</li>
							<li>Last Name: {this._results.lastName}</li>
							<li>Email: {this._results.email}</li>
						</ul>
					</div>
				)}
			</div>
		);
	}
}
