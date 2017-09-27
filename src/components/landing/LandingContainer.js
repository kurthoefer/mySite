import React, { Component } from 'react';
import $ from 'jquery';


class LandingContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			size: undefined,
			origins: undefined,
		};
		this.buildContainerStyles = this.buildContainerStyles.bind(this);
		this.renderTiles = this.renderTiles.bind(this);
		this.moveHandler = this.moveHandler.bind(this);
		this.generateSize = this.generateSize.bind(this);
	}
	
	componentWillMount() {
		this.generateSize();
		$(window).on('resize', this.generateSize)
	}

	render() {
		return (
			<div className="LandingContainer" style={this.buildContainerStyles()}>

				{this.renderTiles()}

			</div>
		)
	}

	componentDidMount() {
		this.moveHandler()
	}

	renderTiles() {
		//render n tiles / give colors
		var size = this.state.size,
				colors = ['green', 'orange', 'purple', 'teal', 'red', 'grey'],
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

	moveHandler() {
		var	touchObj = {},
				size = this.state.size,
				origins = this.state.origins,
				//move the following 2 to generateSize() if needed outside of moveHandler()
				currentOrigin = origins[0],
				currentOriginIndex = 0,
				initX,
				initY,
				distX,
				distY;


		///////////////////
		var tile = currentOriginIndex + 1,
				currentRow = 1,
				tileColumb = 1,
				tileRow = 1;

		
		/////////////////////

		$('.LandingContainer').on({	
			touchstart: initTouch,
			touchmove: touchMoved,
			touchend: endTouch,
		});

		function initTouch(e) {
			e.preventDefault();
			recieveTouchList(e)
			initX = touchObj.pageX;
			initY = touchObj.pageY;
		}

		function touchMoved(e) {
			e.preventDefault();
			recieveTouchList(e)
			//movement of page
			distX = touchObj.pageX - initX;
			distY = touchObj.pageY - initY;
			$('.LandingContainer').offset({ top: distY + currentOrigin[1], left: distX + currentOrigin[0] });

			// for testing purposes
			$('.LandingTile').html(`width: ${size.viewPortWidth}, height: ${size.viewPortHeight}, loc: ( ${distX}, ${distY} ), COIndex: ${currentOriginIndex}, currentOrigin: ${origins[currentOriginIndex]}, origins: ${origins[0]}`)
		}

		function endTouch(e) {
			e.preventDefault();

			for( let i = tile; i > 0; i - size.nColumbs ){
				if( i <= size.nColumbs ){
					tileColumb = i
				}
			}

			for( let i = size.nColumbs; i <= tile; i += size.nColumbs ){
				if( i >= tile ) tileRow = currentRow
					currentRow++
			}
			// tile navigation changes origin
			// left & right
			if( Math.abs(distX) > size.viewPortWidth / 3 ){
				if( distX < 0 ){
					//if distX is - test if the origin can move right
					if( tileColumb !== size.nColumbs && tile !== size.nTiles ){
						currentOriginIndex++
					}
				} else if( distX > 0 ){
					//if distX is + test if the origin can move left
					if( tile - 1 > 0 && tileColumb !== 1){
						currentOriginIndex--
					}
				}
			}

			// up & down
			if( Math.abs(distY) > size.viewPortHeight / 3 ){
				if( distY < 0 ){
					//if distY is - test if origin can move down & find new OriginIndex
					if( tileRow !== size.nRows ){
						currentOriginIndex += size.nColumbs
						if( currentOriginIndex > size.nTiles - 1 ){
							currentOriginIndex = size.nTiles - 1
						}
					}
				} else if( distY > 0 ){
					//if distY is + test if origin can move up & find new OriginIndex
					if( tileRow > 1 ){
						currentOriginIndex -= size.nColumbs
					}
				}
			}
			// recieveTouchList(e)
			currentOrigin = origins[currentOriginIndex]
			$('.LandingContainer').offset( originToOffset() )
		}

		function recieveTouchList(e) {
			touchObj = e.changedTouches[0];
		}

		function originToOffset() {
			let x = currentOrigin[0]
			let y = currentOrigin[1]
			return { top: y, left: x }
		}

	}


// should later revize to generateSpandrels 
//													(since this function determines all the structural values to be used)
	generateSize() {
		// set nTiles here *******
		var nTiles = 6;
		var size = {
			viewPortHeight: $(window).height(),
			viewPortWidth: $(window).width(),
			nTiles: nTiles,
			nColumbs: Math.round(Math.sqrt(nTiles) - 0.20),
			nRows: undefined
		};
		size.nRows = (nTiles % size.nColumbs > 0) ? size.nColumbs + 1 : size.nColumbs;


		// origin loc generation
		var origins = {}, 
				currentRow = 0, 
				currentColumb = 0;

		for( var i = 0; i < size.nTiles; i++ ){
			let x = size.viewPortWidth * currentColumb;
			let y = size.viewPortHeight * currentRow;

			origins[ i ] = [ -x, -y ]
			currentColumb++

			if( currentColumb === size.nColumbs ){
				currentColumb = 0
				currentRow++
			}
		}

		this.setState({ size })
		this.setState({ origins })
		console.log('origins: ', origins)
	}

	buildContainerStyles() {
		console.log("size", this.state.size)
		var size = this.state.size
		return {
			width: size.viewPortWidth * size.nColumbs,
			height: size.viewPortHeight * size.nRows
		}
	}

}

export default LandingContainer;

















