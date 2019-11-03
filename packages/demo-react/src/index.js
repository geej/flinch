import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return 'hello!!!';
  }
}
ReactDOM.render(
  <div height="200" width="200">
    <App />
  </div>,
  document.getElementById("root")
);
