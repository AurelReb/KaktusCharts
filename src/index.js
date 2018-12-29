import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App
        type='line'
        width={window.innerWidth}
        height={window.innerHeight-3}
    />
    ,document.getElementById('root')
);

serviceWorker.register();
