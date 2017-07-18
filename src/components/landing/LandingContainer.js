import React, { Component } from 'react';
import $ from 'jquery';

class LandingContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {};

		this.buildContainerStyles = this.buildContainerStyles.bind(this);
	}
	
	buildContainerStyles(nTiles) {
		var size = {
			viewPortHeight: $(window).height(),
			viewPortWidth: $(window).width(),
			nColumbs: Math.round(Math.sqrt(nTiles) - 0.20),
			nRows: undefined
		}

		size.nRows = (nTiles % size.nColumbs > 0) ? size.nColumbs + 1 : size.nColumbs;
		// console.log(size)

		return {
			width: size.viewPortWidth * size.nColumbs,
			height: size.viewPortHeight * size.nRows
		}

	}

	render() {
		return (
			<div className="LandingContainer" style={this.buildContainerStyles(4)}>
				<div className="LandingTile">
				</div>
			</div>
		)
	}
	
}

export default LandingContainer;