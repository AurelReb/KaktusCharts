import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LineChart from './LineChart';
import * as serviceWorker from './serviceWorker';
import {randomSeries} from './serie'

let data1 = []
for(var i = 0 ; i < 10000 ; i++) {
    data1.push([i, Math.sin(i)])
}


ReactDOM.render(
    <LineChart
        lines={[
            {data: randomSeries(123532) }
        ]}
        width={window.innerWidth}
        height={window.innerHeight-3}
    />
    ,document.getElementById('root')
);

serviceWorker.register();
