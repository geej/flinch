import React from 'react';
import * as ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

class App extends React.Component {
  render() {
    return 'hello!!!';
  }
}

ReactDOM.render(
  <div height="200" width="200">
    <App />
    <RaisedButton label="hi" />
  </div>,
  document.getElementById("root")
);
