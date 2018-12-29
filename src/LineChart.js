import React, { Component } from 'react';
import * as Pixi from 'pixi.js'


class LineChart extends Component {
    app: Pixi.Application
    gameCanvas: HTMLDivElement

    constructor(props) {
        super(props)
        var {max_x, min_x} = this.getLinesBoundaries(this.props.lines)
        this.state = {
            stroke: {
                width: 1,
                color: 0xFF008FFB,
                alpha: 1
            },
            max_data_x: max_x,
            min_data_x: min_x,
            display_max_x: max_x - 1/3 * (max_x - min_x),
            display_min_x: min_x + 1/3 * (max_x - min_x),
            data: null,
            dragging: false,
        }
    }

    componentDidMount() {
        this.app = new Pixi.autoDetectRenderer(this.props.width, this.props.height, {antialias: true, transparent: true})
        this.gameCanvas.appendChild(this.app.view)
        this.stage = new Pixi.Container()

        this.setupLineChart()
        this.setupTraveller()
        this.app.render(this.stage)
    }

    setupLineChart() {
        let {width, color, alpha} = this.state.stroke
        this.lines = new Pixi.Graphics()
        this.lines.lineStyle(width, color, alpha)
        this.lineChart(0, 0, this.app.width, this.app.height * 5/6, this.state.display_min_x, this.state.display_max_x, this.props.lines)
        this.stage.addChild(this.lines)
    }

    setupTraveller() {
        let {width, color, alpha} = this.state.stroke
        this.traveller = new Pixi.Graphics()
        this.traveller.lineStyle(width, color, alpha)
        this.traveller.interactive = true
        this.traveller.on('mousedown', event => this.onDragStart(event))
                        .on('touchstart', event => this.onDragStart(event))
                        .on('mouseup', () => this.onDragEnd())
                        .on('mouseupoutside', () => this.onDragEnd())
                        .on('touchend', () => this.onDragEnd())
                        .on('touchendoutside', () => this.onDragEnd())
                        .on('mousemove', () => this.onDragMove())
                        .on('touchmove', () => this.onDragMove());

        this.lineChart(0, this.app.height * 5/6, this.app.width, this.app.height * 1/6, this.state.min_data_x, 1700123529, [this.props.lines[0], ])
        this.drawTraveller(0, this.app.height * 5/6, this.app.width, this.app.height * 1/6, this.state.display_min_x, this.state.display_max_x)
        this.stage.addChild(this.traveller)
    }

    onDragStart(event) {
        console.log("start")
        this.setState({data: event.data, dragging: true})
    }

    onDragEnd() {
        console.log("end")
        this.setState({data: null, dragging: false})
    }

    onDragMove() {
        console.log("move!")
        if (this.state.dragging) {
            var newPosition = this.state.data.width;
            this.setState({display_min_x: newPosition.x}) // a compléter!
            this.drawTraveller(0, this.app.height * 5/6, this.app.width, this.app.height * 1/6, this.state.display_min_x, this.state.display_max_x)
        }
    }


    drawTraveller = (x, y, width, height, from_x, to_x) => {
        this.traveller.beginFill(0xAAAAAA, 0.1);

        this.traveller.lineStyle(3, 0x000000);
        let multip = width / Math.abs(this.state.max_data_x - this.state.min_data_x)
        console.log(multip * Math.abs(from_x - to_x))
        // draw a rectangle
        this.traveller.drawRect(multip * Math.abs(this.state.min_data_x - from_x), y, multip * Math.abs(from_x - to_x), height);
    }

    lineChart = (pos_x, pos_y, width, height, from_x, to_x, lines) => {
        lines.forEach(line => {
            line.data.sort((a,b) => a[0] <= b[0] ? -1 : 1)
        })
        //setup des variables nécessaires au sizing du chart
        console.log(from_x, to_x)
        var cropped_lines = lines.map(line => {
            let from_index = 0
            let to_index   = 0
            for (var i = 0 ; i < line.data.length -1; i++) {
                if (line.data[i][0] <= from_x && from_x <= line.data[i+1][0])
                    from_index = i
                if (line.data[i][0] <= to_x && to_x <= line.data[i+1][0])
                    to_index = i
            }
            console.log(from_index, to_index)
            return {...line, data:line.data.slice(from_index, to_index)}
        })
        var {max_x, max_y, min_x, min_y} = this.getLinesBoundaries(cropped_lines)

        let multi_x = width / Math.abs(max_x - min_x)
        let multi_y = height / Math.abs(max_y - min_y)
        //dessiner le graphique
        cropped_lines.forEach( line => {
            console.log(line.data)
            this.lines.moveTo(pos_x, height - Math.abs(line.data[0][1] - min_y) * multi_y + pos_y)
            let ratio_px = width <= line.data.length ? (line.data.length - 1) / width : 1 //pour afficher 1 donnée max par px
            for (let i = 1; i < line.data.length / ratio_px; i++) {
                let coordinates = line.data[Math.floor(i * ratio_px)]
                let x = Math.abs(coordinates[0] - min_x) * multi_x
                let y = height - Math.abs(coordinates[1] - min_y) * multi_y
                x += pos_x
                y += pos_y
                this.lines.lineTo(x, y)
            }
        })
    }


    getLinesBoundaries(lines) {
        var max_x = lines[0].data[0][0]
        var max_y = lines[0].data[0][1]
        var min_x = lines[0].data[0][0]
        var min_y = lines[0].data[0][1]

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
        return {max_x, max_y, min_x, min_y}
    }


    render() {

        return (
            <div ref={(thisDiv) => {this.gameCanvas = thisDiv}}></div>
        );
    }
}

export default LineChart;
