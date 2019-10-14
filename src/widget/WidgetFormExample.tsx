import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TextInput from '@dojo/widgets/text-input';
import Button from '@dojo/widgets/button';

import Form from './Form';

interface Fields {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
}

const factory = create({ icache });

export default factory(function MiddlewareFormExample({ middleware: { icache } }) {
	const results = icache.get<Fields>('results');

  return (
    <div>
      <Form
				onSubmit={(value) => icache.set('results', value)}
				renderer={({ values, required, valid, form, disabled }) => {
					const { get, set } = values<Fields>();

					required('firstName', true);
					required('lastName', true);

					return [
						<TextInput
							label="First Name"
							placeholder="Enter first name (must be Daniel)"
							pattern="Daniel"
							required={true}
							value={get('firstName')}
							onInput={val => set('firstName', String(val))}
							onValidate={(value, message) => valid('firstName', value, message)}
							disabled={disabled()}
						/>,
						<TextInput
							label="Middle Name"
							placeholder="Enter a middle name"
							required={required('middleName')}
							value={get('middleName')}
							onInput={val => set('middleName', String(val))}
							onValidate={(value, message) => valid('middleName', value, message)}
							maxLength={5}
							disabled={disabled()}
						/>,
						<TextInput
							label="Last Name"
							placeholder="Enter a last name"
							required={true}
							value={get('lastName')}
							onInput={val => set('lastName', String(val))}
							onValidate={(value, message) => valid('lastName', value, message)}
							minLength={2}
							disabled={disabled()}
						/>,
						<TextInput
							label="Email"
							placeholder="Enter an email address"
							required={false}
							value={get('email')}
							onInput={val => set('email', String(val))}
							onValidate={(value, message) => valid('email', value, message)}
							type="email"
							pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
							disabled={disabled('email')}
						/>,
						<Button
							type="button"
							disabled={disabled()}
							onClick={() => {
								values({
									firstName: 'Daniel',
									middleName: '',
									lastName: 'Lautzenheiser'
								});
							}}>
							Fill
						</Button>,
						<Button type="button" disabled={disabled()} onClick={() => required('middleName', !required('middleName'))}>
							{`Make middle name ${required('middleName') ? 'optional' : 'required'}`}
						</Button>,
        		<Button type="button" disabled={disabled()} onClick={() => form.reset()}>Reset</Button>,
						<Button type="button" onClick={() => form.disabled(!form.disabled())}>
							{`${disabled() ? 'Enable' : 'Disable'} Form`}
						</Button>,
						<Button type="button" disabled={disabled()} onClick={() => disabled('email', !disabled('email'))}>
							{`${disabled('email') ? 'Enable' : 'Disable'} Email`}
						</Button>,
						<Button type="submit" disabled={!valid() || disabled()}>
							Submit
						</Button>
					];
				}}
			/>
      {results && (
        <div>
          <h2>Results</h2>
          <ul>
            <li>First Name: {results.firstName}</li>
            <li>Middle Name: {results.middleName}</li>
            <li>Last Name: {results.lastName}</li>
            <li>Email: {results.email}</li>
          </ul>
        </div>
      )}
    </div>
  );
});
