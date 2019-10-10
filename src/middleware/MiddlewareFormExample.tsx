import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TextInput from '@dojo/widgets/text-input';
import Button from '@dojo/widgets/button';

import createFormMiddleware from './form';

interface Fields {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
}

const form = createFormMiddleware<Fields>();
const factory = create({ form, icache });

export default factory(function MiddlewareFormExample({ middleware: { form, icache } }) {
  const firstName = form.field('firstName', true);
  const middleName = form.field('middleName');
  const lastName = form.field('lastName', true);
  const email = form.field('email');

  const onSubmit = () => form.submit((values) => icache.set('results', values), {
    firstName: '',
    lastName: ''
  });

  const toggleRequired = () => middleName.required(!middleName.required());

  const results = icache.get<Fields>('results');

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
          onClick={() => form.value({
            firstName: 'Daniel',
            middleName: '',
            lastName: 'Lautzenheiser'
          })}>
          Fill
        </Button>
        <Button type="button" onClick={toggleRequired}>
          {`Make middle name ${middleName.required() ? 'optional' : 'required'}`}
        </Button>
        <Button type="button" onClick={form.reset}>Reset</Button>
        <Button type="button" disabled={!form.valid()} onClick={onSubmit}>
          Submit
        </Button>
      </form>
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
