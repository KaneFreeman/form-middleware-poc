import { tsx, create, renderer } from '@dojo/framework/core/vdom';

import MiddlewareFormExample from './middleware/MiddlewareFormExample';
import MetaFormExample from './meta/MetaFormExample';

const factory = create();

const App = factory(() => {
  return (
    <div>
      <h2>Middleware</h2>
      <MiddlewareFormExample />
      <h2>Meta</h2>
      <MetaFormExample />
    </div>
  );
});

const r = renderer(() => <App />);
r.mount();
