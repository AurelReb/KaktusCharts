import React, { Component } from 'react';
import { Stage, Graphics } from '@inlet/react-pixi'

class Traveller extends Component {
    constructor(props) {
        super(props)
        this.state = this.props.state
    }

    setupTraveller() {
        this.traveller.interactive = true
        this.traveller.on('mousedown', event => this.onDragStart(event))
                        .on('touchstart', event => this.onDragStart(event))
                        .on('mouseup', () => this.onDragEnd())
                        .on('mouseupoutside', () => this.onDragEnd())
                        .on('touchend', () => this.onDragEnd())
                        .on('touchendoutside', () => this.onDragEnd())
                        .on('mousemove', () => this.onMouseMove())
                        .on('touchmove', () => this.onMouseMove());

        this.props.lineChart(0, this.props.height * 5/6, this.props.width, this.props.height * 1/6, this.state.min_data_x, 1700123529, [this.props.lines[0], ])
        this.drawTraveller(0, this.props.height * 5/6, this.props.width, this.props.height * 1/6, this.state.display_min_x, this.state.display_max_x)
    }

    onDragStart(event) {
        let multip = this.props.width / Math.abs(this.state.max_data_x - this.state.min_data_x)
        this.setState({
            data: event.data,
            dragging: true,
            initial_spread: this.state.display_max_x - this.state.display_min_x,
            initial_cursor_pos: event.data.getLocalPosition(this.traveller).x - multip * Math.abs(this.state.min_data_x - this.state.display_min_x)
        })

        let newPosition = event.data.getLocalPosition(this.traveller).x
        let right_side_pos = multip * Math.abs(this.state.min_data_x - this.state.min_data_x + this.state.initial_spread)
        let dragging_side = ""
        if(this.state.initial_cursor_pos < 25) {
            dragging_side = "left"
        } else if(this.state.initial_cursor_pos + 25 > right_side_pos) {
            console.log("RIGHT!!:")
            dragging_side = "right"
        } else {
            dragging_side = "middle"
        }
        this.setState({dragging_side: dragging_side})
    }

    onDragEnd() {
        this.setState({data: null, dragging: false})
        this.props.wrapperEnd()
        this.props.lineChart(0, 0, this.props.width, this.props.height * 5/6, this.state.display_min_x, this.state.display_max_x, this.props.lines)
        this.props.lineChart(0, this.props.height * 5/6, this.props.width, this.props.height * 1/6, this.state.min_data_x, 1700123529, [this.props.lines[0], ])
    }

    onMouseMove() {
        if (this.state.dragging) {
            let newPosition = this.state.data.getLocalPosition(this.traveller).x
            if(newPosition - this.state.initial_cursor_pos > 0) {
                newPosition -= this.state.initial_cursor_pos
            } else {
                newPosition = 0
            }
            let multip = this.props.width / Math.abs(this.state.max_data_x - this.state.min_data_x)
            switch(this.state.dragging_side) {
                case "left":
                    this.setState({display_min_x: this.state.min_data_x + newPosition / multip })
                    break
                case "right":
                    this.setState({display_max_x: this.state.min_data_x + this.state.data.getLocalPosition(this.traveller).x / multip })
                    break
                case "middle":
                    this.setState({display_min_x: this.state.min_data_x + newPosition / multip })
                    this.setState({display_max_x: this.state.min_data_x + newPosition / multip + this.state.initial_spread })
                    break
            }
        //    multip * Math.abs(this.state.min_data_x - to_x)
            this.traveller.clear()
            this.drawTraveller(0, this.props.height * 5/6, this.props.width, this.props.height * 1/6, this.state.display_min_x, this.state.display_max_x)
        }
    }


    drawTraveller = (x, y, width, height, from_x, to_x) => {
        this.traveller.beginFill(0xAAAAAA, 0.1);

        this.traveller.lineStyle(3, 0x000000);
        let multip = width / Math.abs(this.state.max_data_x - this.state.min_data_x)
        // draw a rectangle
        this.traveller.drawRect(multip * Math.abs(this.state.min_data_x - from_x), y, multip * Math.abs(from_x - to_x), height);
        //his.traveller.beginFill(0x000000, 1);
        this.traveller.drawRect(multip * Math.abs(this.state.min_data_x - from_x), y, 25, height);
        this.traveller.drawRect(multip * Math.abs(this.state.min_data_x - to_x), y, 25, height);
    }

    render() {
        return(
            <Graphics
                draw={traveller => {
                    this.traveller = traveller
                    this.setupTraveller()
                }}
            />
        )
    }
}

export default Traveller
