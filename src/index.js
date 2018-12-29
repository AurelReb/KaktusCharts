import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LineChart from './LineChart';
import * as serviceWorker from './serviceWorker';
import {randomSeries} from './serie'

ReactDOM.render(
    <LineChart
        lines={[
            {data: randomSeries(123532) },
            {data: randomSeries(123532) }
        ]}
        width={window.innerWidth}
        height={window.innerHeight-3}
    />
    ,document.getElementById('root')
);

serviceWorker.register();
