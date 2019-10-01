import { tsx, create, renderer } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TextInput from '@dojo/widgets/text-input';
import Button from '@dojo/widgets/button';

import createFormMiddleware from './Form';

interface Form {
  firstName: string;
  middleName?: string;
  lastName: string;
}

const form = createFormMiddleware<Form>();
const factory = create({ form, icache });

const App = factory(({ middleware: { form, icache } }) => {
  const firstName = form.field('firstName', true);
  const middleName = form.field('middleName');
  const lastName = form.field('lastName', true);

  const onSubmit = () => form.submit((values) => icache.set('results', values), {
    firstName: '',
    lastName: ''
  });

  const toggleRequired = () => middleName.required(!middleName.required());

  const results = icache.get<Form>('results');

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
        <Button type="button" onClick={form.reset}>Reset</Button>
        <Button type="button" disabled={!form.valid()} onClick={onSubmit}>
          Submit
        </Button>
      </form>
      {results && (
        <div>
          <h2>Results</h2>
          <p>
            First Name: {results.firstName}<br />
            Middle Name: {results.middleName}<br />
            Last Name: {results.lastName}
          </p>
        </div>
      )}
    </div>
  );
});

const r = renderer(() => <App />);
r.mount();
