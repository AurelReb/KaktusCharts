import React, { Component } from 'react';
import * as Pixi from 'pixi.js'


class LineChart extends Component {
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

        this.setupLineChart()

        this.app.render(this.stage)
    }

    setupLineChart() {
        let {width, color, alpha} = this.state.stroke
        this.lines = new Pixi.Graphics()
        this.lines.lineStyle(width, color, alpha)
        this.lineChart(this.props.lines)
        this.stage.addChild(this.lines)
    }

    lineChart = lines => {
        //setup des variables nécessaires au sizing du chart
        var max_x = 0, max_y = 0, min_x = 0, min_y = 0
        lines.forEach( line => {
            line.data.sort((a,b) => a[0] <= b[0] ? -1 : 1)
            let max_line_x = Math.max.apply(Math, line.data.map(x => x[0]))
            let min_line_x = Math.min.apply(Math, line.data.map(x => x[0]))
            let max_line_y = Math.max.apply(Math, line.data.map(x => x[1]))
            let min_line_y = Math.min.apply(Math, line.data.map(x => x[1]))

            if(max_line_x > max_x) max_x = max_line_x
            if(min_line_x < min_x) min_x = min_line_x
            if(max_line_y > max_y) max_y = max_line_y
            if(min_line_y < min_y) min_y = min_line_y
        })
        console.log(max_x, min_x, max_y, min_y)
        let delta_x = Math.abs(max_x - min_x)
        let delta_y = Math.abs(max_y - min_y)

        let multi_x = this.app.width / delta_x
        let multi_y = this.app.height / delta_y
        //dessiner le graphique
        this.lines.moveTo(0, this.app.height - Math.abs(lines[0].data[0][1] - min_y) * multi_y)
        this.lines.moveTo(0, 0)
        lines.forEach( line => {
            console.log(line.data)
            let ratio_px = this.app.width <= line.data.length ? (line.data.length - 1) / this.app.width : 1 //pour afficher 1 donnée max par px
            for (let i = 1; i < line.data.length / ratio_px; i++) {
                let coordinates = line.data[Math.floor(i * ratio_px)]
                let x = Math.abs(coordinates[0] - min_x) * multi_x
                let y = this.app.height - Math.abs(coordinates[1] - min_y) * multi_y
                this.lines.lineTo(x, y)
            }
        })
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

export default LineChart;
