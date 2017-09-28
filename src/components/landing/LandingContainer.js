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
				colors = ['green', 'orange', 'purple', 'teal', 'red', 'black', 'blue', 'yellow', 'green'],
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


		///////////////////  for endTouch()
		var currentTile = currentOriginIndex + 1,
			// tileRow = 1,
			currentRow = 1,
			currentColumb = 1,
			nEmptyUnits = size.nColumbs - ( size.nTiles % size.nColumbs );
		
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
			// $('.LandingTile').html(`width: ${size.viewPortWidth}, height: ${size.viewPortHeight}, loc: ( ${distX}, ${distY} ), COIndex: ${currentOriginIndex}, currentOrigin: ${origins[currentOriginIndex]}, currentTile: ${currentTile}`)
		}

		function endTouch(e) {
			e.preventDefault();
			// $('.LandingTile').html(`currentColumb: ${currentColumb}`)

			// distinguish the columb that currentTile is located
			// for( let i = currentTile; i > 0; i - size.nColumbs ){
			// 	if( i <= size.nColumbs ) {
			// 		currentColumb = i;
			// 		break;
			// 	}
			// }


			// $('.LandingTile').html(`currentColumb: ${currentColumb}`)

			// distinguish the row that currentTile is located
			// for( let i = size.nColumbs; i < currentTile; i += size.nColumbs ) currentRow++;

			// tile navigation changes origin
			// left & right
			if( Math.abs(distX) > size.viewPortWidth / 3 ){
				if( distX < 0 ){
					//if distX is - test if the origin can move right
					if( currentColumb !== size.nColumbs && currentTile !== size.nTiles ){
						currentOriginIndex++
						currentColumb++
					}
				} else if( distX > 0 ){
					//if distX is + test if the origin can move left
					if( currentTile - 1 > 0 && currentColumb !== 1){
						currentOriginIndex--
						currentColumb--
					}
				}
			}


			// up & down
			if( Math.abs(distY) > size.viewPortHeight / 3 ){
				if( distY < 0 ){
					//if distY is - test if origin can move down & find new OriginIndex
					if( currentRow < size.nRows ){
						currentOriginIndex += size.nColumbs
						currentRow++
						if( currentOriginIndex > size.nTiles - 1 ){
							currentColumb -= nEmptyUnits
							currentOriginIndex = size.nTiles - 1
						}
					}
				} else if( distY > 0 ){
					//if distY is + test if origin can move up & find new OriginIndex
					if( currentRow > 1 ){
						currentRow--
						currentOriginIndex -= size.nColumbs
					}
				}
			}
			// console.log(`nTiles is: ${size.nTiles}`);
			// console.log(`size.nColumbs: ${size.nColumbs}`);
			// console.log(`size.nRows: ${size.nRows}`);
			console.log(`currentColumb is: ${currentColumb}`);
			console.log(`currentRow is: ${currentRow}`);

			currentTile = currentOriginIndex + 1;
			currentOrigin = origins[currentOriginIndex]
			$('.LandingContainer').offset( originToOffset() )

			// for testing purposes
			// $('.LandingTile').html(`width: ${size.viewPortWidth}, height: ${size.viewPortHeight}, loc: ( ${distX}, ${distY} ), currentOriginIndex: ${currentOriginIndex}, currentOrigin: ${origins[currentOriginIndex]}, currentTile: ${currentTile}`)
		}

		function recieveTouchList(e) {
			touchObj = e.changedTouches[0];
		}

		function originToOffset() {
			distX = 0
			distY = 0
			let x = currentOrigin[0]
			let y = currentOrigin[1]
			return { top: y, left: x }
		}

	}


// should later revize to generateSpandrels 
//													(since this function determines all the structural values to be used)
	generateSize() {

		//*********************************//
		//******** set nTiles below *******//
		//*********************************//
		var nTiles = 8;

		var size = {
			viewPortHeight: $(window).height(),
			viewPortWidth: $(window).width(),
			nTiles: nTiles,
			nColumbs: Math.round(Math.sqrt(nTiles) - 0.20),
			nRows: 0
		};
		//use better object decoration meathod for "size"
		// size.nRows = (nTiles % size.nColumbs > 0) ? size.nColumbs + 1 : size.nColumbs;

		for( let i = size.nTiles; i > 0; i -= size.nColumbs ) size.nRows++;




		// origin loc generation
		var origins = {}, 
				currentRowIndex = 0, 
				currentColumbIndex = 0;

		for( var i = 0; i < size.nTiles; i++ ){
			let x = size.viewPortWidth * currentColumbIndex;
			let y = size.viewPortHeight * currentRowIndex;

			origins[ i ] = [ -x, -y ]
			currentColumbIndex++

			if( currentColumbIndex === size.nColumbs ){
				currentColumbIndex = 0
				currentRowIndex++
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

















