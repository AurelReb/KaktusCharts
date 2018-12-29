import React, { Component } from 'react';
import * as Pixi from 'pixi.js'
import {randomSeries} from './serie'

const testData = [[0,1], [10, 2], [20, 5], [30, 2]]

class App extends Component {
    app: Pixi.Application
    gameCanvas: HTMLDivElement

    componentDidMount() {
        this.app = new Pixi.autoDetectRenderer(this.props.width, this.props.height, {antialias: true})
        this.gameCanvas.appendChild(this.app.view)
        this.stage = new Pixi.Container()
        this.line = new Pixi.Graphics()
        this.line.lineStyle(1, 0xFF008FFB, 1)
        let test = randomSeries(25000)
        console.log(test)
        this.lineChart(test)
        this.stage.addChild(this.line)
        this.app.render(this.stage)
    }

    lineChart = data => {
        data.sort((a,b) => a[0] <= b[0] ? -1 : 1)
        let ratio = this.app.width <= data.length ? (data.length - 1) / this.app.width : 1

        let maxx = Math.max.apply(Math, data.map(x => x[0]))
        let minx = Math.min.apply(Math, data.map(x => x[0]))
        let deltax = Math.abs(maxx - minx)

        let maxy = Math.max.apply(Math, data.map(x => x[1]))
        let miny = Math.min.apply(Math, data.map(x => x[1]))
        let deltay = Math.abs(maxy - miny)

        let multix = this.app.width / deltax
        let multiy = this.app.height / deltay

        this.line.moveTo(0, this.app.height - Math.abs(data[0][1] - miny) * multiy)
        for (let i = 1; i < data.length / ratio; i++) {
            let coordinates = data[Math.floor(i * ratio)]
            let x = Math.abs(coordinates[0] - minx) * multix
            let y = this.app.height - Math.abs(coordinates[1] - miny) * multiy
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

const defaultState = {
    stroke: {
        width: 2,
        color: 0xFF008FFB,
        alpha: 1
    }
}

export default App;
