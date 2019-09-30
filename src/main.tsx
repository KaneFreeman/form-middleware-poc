import { tsx, create, renderer } from '@dojo/framework/core/vdom';

import TextInput from '@dojo/widgets/text-input';
import Button from '@dojo/widgets/button';

import createFormMiddleware from './Form';

interface Form {
  firstName: string;
  middleName?: string;
  lastName: string;
}

const form = createFormMiddleware<Form>();
const factory = create({ form });

const App = factory(({ middleware: { form } }) => {
  const firstName = form.field('firstName', true);
  const middleName = form.field('middleName');
  const lastName = form.field('lastName', true);

  const onSubmit = () => form.submit((values) => {
    alert(values);
  }, {
    firstName: '',
    lastName: ''
  });

  console.log(form.valid(), form.value(), middleName.required());
  const toggleRequired = () => middleName.required(!middleName.required());

  return (
    <div class="flex items-center mb-6 m-6">
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
        <Button type="button" disabled={!form.valid()} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
});

const r = renderer(() => <App />);
r.mount();
