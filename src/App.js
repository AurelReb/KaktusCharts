import React, { Component } from 'react';
import * as Pixi from 'pixi.js'
import {randomSeries} from './serie'

const testData = randomSeries(123532)

class App extends Component {
    app: Pixi.Application
    gameCanvas: HTMLDivElement

    constructor(props) {
        super(props)
        this.state = {
            stroke: {
                width: 1,
                color: 0xFF008FFB,
                alpha: 1
            }
        }
    }

    componentDidMount() {
        this.app = new Pixi.autoDetectRenderer(this.props.width, this.props.height, {antialias: false})
        this.gameCanvas.appendChild(this.app.view)
        this.stage = new Pixi.Container()

        if (this.props.type === 'line') this.setupLineChart()

        this.app.render(this.stage)
    }

    setupLineChart() {
        let {width, color, alpha} = this.state.stroke
        this.line = new Pixi.Graphics()
        this.line.lineStyle(width, color, alpha)
        this.lineChart(testData)
        this.stage.addChild(this.line)
    }

    lineChart = data => {
        data.sort((a,b) => a[0] <= b[0] ? -1 : 1)
        let ratio_px = this.app.width <= data.length ? (data.length - 1) / this.app.width : 1 //pour afficher 1 donnée max par px
        //setup des variables nécessaires au sizing du chart
        let max_x = Math.max.apply(Math, data.map(x => x[0]))
        let min_x = Math.min.apply(Math, data.map(x => x[0]))
        let delta_x = Math.abs(max_x - min_x)

        let max_y = Math.max.apply(Math, data.map(x => x[1]))
        let min_y = Math.min.apply(Math, data.map(x => x[1]))
        let delta_y = Math.abs(max_y - min_y)

        let multi_x = this.app.width / delta_x
        let multi_y = this.app.height / delta_y
        //dessiner le graphique
        this.line.moveTo(0, this.app.height - Math.abs(data[0][1] - min_y) * multi_y)
        for (let i = 1; i < data.length / ratio_px; i++) {
            let coordinates = data[Math.floor(i * ratio_px)]
            let x = Math.abs(coordinates[0] - min_x) * multi_x
            let y = this.app.height - Math.abs(coordinates[1] - min_y) * multi_y
            this.line.lineTo(x, y)
        }
    }

    componentWillUnmount() {
        this.app.stop()
    }

    render() {

        return (
            <div ref={(thisDiv) => {this.gameCanvas = thisDiv}}></div>
        );
    }
}

export default App;
