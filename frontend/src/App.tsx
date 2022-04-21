import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRouter from './router';

class App extends React.Component {
  render() {
    return (
      <AppRouter/>
    );
  }
}

export default App;
