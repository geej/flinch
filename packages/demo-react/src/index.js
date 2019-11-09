import React from 'react';
import * as ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TemporaryDrawer from './TemporaryDrawer';
class App extends React.Component {
  render() {
    return 'hello!!!';
  }
}

function ButtonAppBar(props) {
  return (
    <div style="flex-grow: 1;">
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style="flex-grow: 1;">
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

class Portal extends React.Component {
  render() {
    return ReactDOM.createPortal(<div>{ this.props.children }</div>, document.getElementById('portal'));
  }
}

ReactDOM.render(
  <div height="200" width="200">
    <ButtonAppBar />
    <TemporaryDrawer />
    <App />
    <React.Fragment>
      hello there
      <div>
        how
      </div>
      <div>
        are
      </div>
      <div>
        you
      </div>
      ?
    </React.Fragment>
    <div>
      <div>
        <div>
          simple nested div
        </div>
      </div>
    </div>
    <Portal>hi</Portal>
  </div>,
  document.getElementById("root")
);
