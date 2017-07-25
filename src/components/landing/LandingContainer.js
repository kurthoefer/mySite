import React, { Component } from 'react';
import $ from 'jquery';

class LandingContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			size: undefined,
		};
		this.buildContainerStyles = this.buildContainerStyles.bind(this);
		this.renderTiles = this.renderTiles.bind(this);
	}
	
	componentWillMount() {
		this.generateSize();
	}

	generateSize() {
		var nTiles = 4;
		var size = {
			viewPortHeight: $(window).height(),
			viewPortWidth: $(window).width(),
			nTiles: nTiles,
			nColumbs: Math.round(Math.sqrt(nTiles) - 0.20),
			nRows: undefined
		};
		size.nRows = (nTiles % size.nColumbs > 0) ? size.nColumbs + 1 : size.nColumbs;
		this.setState({ size })
	}

	buildContainerStyles() {
		console.log("size", this.state.size)
		var size = this.state.size
		return {
			width: size.viewPortWidth * size.nColumbs,
			height: size.viewPortHeight * size.nRows
		}

	}

	renderTiles() {
		//render n tiles / give colors
		var size = this.state.size,
				colors = ['green', 'orange', 'purple', 'teal'],
				tiles = [],
				tileSize = {
					height: size.viewPortHeight,
					width: size.viewPortWidth
				};


		for(let i = 0; i < size.nTiles; i++) {
			let styles = Object.assign({}, tileSize, { backgroundColor: colors[i] })
			tiles.push(
					<div className="LandingTile" style={styles}>
					</div>
				)
 		}
 		return tiles.map(tile => tile)
	}
	
		
	render() {
		return (
			<div className="LandingContainer" style={this.buildContainerStyles()}>

				{this.renderTiles()}

			</div>
		)
	}
	
}

export default LandingContainer;