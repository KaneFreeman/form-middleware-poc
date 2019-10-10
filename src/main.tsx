import { tsx, create, renderer } from '@dojo/framework/core/vdom';

import MiddlewareFormExample from './middleware/MiddlewareFormExample';
import WidgetFormExample from './widget/WidgetFormExample';

const factory = create();

const App = factory(() => {
  return (
    <div>
      <h2>Middleware</h2>
      <MiddlewareFormExample />
      <h2>Widget</h2>
      <WidgetFormExample />
    </div>
  );
});

const r = renderer(() => <App />);
r.mount();
