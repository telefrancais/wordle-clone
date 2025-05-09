import React from 'react'
import LetterTile from './LetterTile'
import { WORD_LENGTH } from '../constants/constants'

const GameBoard = ({ guesses, currentGuess, currentGuessIndex, scores, gameState, onLetterChange, onKeyDown }) => {
  // renders the letter tiles with the correct colours
  const renderRowTiles = (rowIndex) => {
    switch (true) {
      case rowIndex === currentGuessIndex && gameState === 'playing':
        return Array(WORD_LENGTH).fill('').map((letter, colIndex) => (
          <LetterTile
            key={colIndex}
            letter={currentGuess[colIndex] || ''}
            status='current'
            index={colIndex}
            isActive={currentGuess.length === colIndex}
            onLetterChange={onLetterChange}
            onKeyDown={onKeyDown}
          />
        ))

      case rowIndex === currentGuessIndex && gameState === 'won':
        return currentGuess.split('').map((letter, colIndex) => (
          <LetterTile
            key={colIndex}
            letter={letter}
            status={2}
          />
        ))

      case rowIndex === currentGuessIndex && gameState === 'lost':
        return currentGuess.split('').map((letter, colIndex) => (
          <LetterTile
            key={colIndex}
            letter={letter}
            status={scores[rowIndex][colIndex]}
          />
        ))

      case rowIndex < currentGuessIndex:
        return guesses[rowIndex].split('').map((letter, colIndex) => (
          <LetterTile
            key={colIndex}
            letter={letter}
            status={scores[rowIndex][colIndex]}
          />
        ))

      default:
        return Array(WORD_LENGTH).fill('').map((letter, colIndex) => (
          <LetterTile
            key={colIndex}
            letter=''
            status='empty'
          />
        ))
    }
  }

  return (
    <div className='grid grid-rows-6 gap-2 mb-8'>
      {guesses.map((letter, rowIndex) => (
        <div key={rowIndex} className='grid grid-cols-5 gap-2'>
          {renderRowTiles(rowIndex)}
        </div>
      ))}
    </div>
  )
}

export default GameBoard