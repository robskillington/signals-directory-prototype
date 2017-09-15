import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap/css/bootstrap.css';
import './bootstrap/css/bootstrap-theme.css';
import './bootstrap/js/bootstrap.js';
import App from './App';
// avoid complication of serviceworker
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
