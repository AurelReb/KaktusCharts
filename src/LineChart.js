import React, { Component } from 'react';
import { Stage, Graphics } from '@inlet/react-pixi'
import Traveller from './Traveller'

class LineChart extends Component {
    app: Pixi.Application
    gameCanvas: HTMLDivElement

    constructor(props) {
        super(props)
        let {max_x, min_x} = this.getLinesBoundaries(this.props.lines)
        this.state = {
            max_data_x: max_x,
            min_data_x: min_x,
            display_max_x: max_x - 1/3 * (max_x - min_x),
            display_min_x: min_x + 1/3 * (max_x - min_x),
            current_display_boundaries: {
                max_x: null,
                min_x: null,
                max_y: null,
                min_y: null
            },
            data: null,
            dragging: false,
            initial_spread: false,
            initial_cursor_pos: null, // initial cursor position from left boundary
            dragging_side: ""
        }
    }

    shouldComponentUpdate() {
        /*this.app = new Pixi.autoDetectRenderer(this.props.width, this.props.height, {antialias: true, transparent: true})
        this.gameCanvas.appendChild(this.app.view)
        this.stage = new Pixi.Container()

        this.setupLineChart()
        this.setupTraveller()
        this.app.render(this.stage)*/
    }

    lineChart = (pos_x, pos_y, width, height, from_x, to_x, lines) => {
        this.lines.lineStyle(1, 0x7cb5ec);
        //setup des variables nécessaires au sizing du chart
        let cropped_lines = lines.map(line => {
            let from_index = 0
            let to_index   = 0
            for (let i = 0 ; i < line.data.length -1; i++) {
                if (line.data[i][0] <= from_x && from_x <= line.data[i+1][0])
                    from_index = i
                if (line.data[i][0] <= to_x && to_x <= line.data[i+1][0])
                    to_index = i
            }
            if(from_index !== 0 && to_index !== 0) {
                return {...line, data:line.data.slice(from_index, to_index)}
            } else {
                return line
            }
        })
        let {max_x, max_y, min_x, min_y} = this.getLinesBoundaries(cropped_lines)
        let multi_x = width / Math.abs(max_x - min_x)
        let multi_y = height / Math.abs(max_y - min_y)
        //dessiner le graphique
        cropped_lines.forEach( line => {
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
        let max_x = lines[0].data[0][0]
        let max_y = lines[0].data[0][1]
        let min_x = lines[0].data[0][0]
        let min_y = lines[0].data[0][1]

        lines.forEach( line => {
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
            <Stage width={this.props.width} height={this.props.height} options={{antialias: true, transparent: true}}>
                <Graphics
                    draw={lines => {
                        this.lines = lines
                        this.lineChart(0, 0, this.props.width, this.props.height * 5/6, this.state.display_min_x, this.state.display_max_x, this.props.lines)
                    }}
                />
                <Traveller
                    width={this.props.width}
                    height={this.props.height}
                    state={this.state}
                    lines={this.props.lines}
                    lineChart={this.lineChart}
                    wrapperEnd={() => this.lines.clear()}
                />
            </Stage>
        );
    }
}

export default LineChart;
