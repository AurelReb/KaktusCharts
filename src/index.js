import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LineChart from './LineChart';
import * as serviceWorker from './serviceWorker';
import {randomSeries} from './serie'

var data = randomSeries(123532)

ReactDOM.render(
    <div>
        <LineChart
            lines={[
                {data: data },
                {data: randomSeries(123532) }
            ]}
            width={window.innerWidth}
            height={window.innerHeight}
        />
    </div>
    ,document.getElementById('root')
);

serviceWorker.register();
