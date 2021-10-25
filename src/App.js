/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import blueCandy from './images/blue.jpeg';
import greenCandy from './images/green.jpeg';
import orangeCandy from './images/orange.jpeg';
import purpleCandy from './images/purple.jpeg';
import redCandy from './images/red.jpeg';
import yellowCandy from './images/yellow.jpeg';
import blank from './images/blank.png';

const width = 8;
const candyColours = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  
  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i];

      // if all columns match, set to empty
      if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor)){
        columnOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true;
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i];
      const notValid = [5,6,7,13,14,15,21,22,23,30,31,37,38,39,45,46,47,53,54,55,62,63,64];

      if (notValid.includes(i)) continue;

      if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor)){
        rowOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true;
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[i];

      if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor)){
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true;
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i];
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64];

      if (notValid.includes(i)) continue;

      if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor)){
        rowOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true;
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++){
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if(isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColours.length)
        currentColorArrangement[i] = candyColours[randomNumber];
      }

      if((currentColorArrangement[i + width]) === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }

    }
  }

  const dragStart = (e) => {
    console.log(e.target);
    console.log('drag start');
    setSquareBeingDragged(e.target);
  }

  const dragDrop = (e) => {
    console.log(e.target);
    console.log('drag drop');
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = (e) => {
    console.log('drag end');

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

    console.log({ squareBeingDraggedId, squareBeingReplacedId});

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ]

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (squareBeingDraggedId && validMove && (isARowOfThree || isARowOfFour || isAColumnOfThree || isAColumnOfFour) ){
      // if move is valid, reset state so you can continue
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      // if invalid, change the squares back to original colors
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);
    }

  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColours[Math.floor(Math.random() * candyColours.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(() => {
    createBoard();
  }, [])

  //every second check for column of 3 and then set the state
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement])
    }, 500)
    return () => clearInterval(timer);

  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])

  return (
    <div className="app">
      <div className='game'>
        {currentColorArrangement.map((candyColour, index) => (
          <img
            key={index}
            src={{candyColour}}
            alt={candyColour}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
            onDragLeave={e => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
