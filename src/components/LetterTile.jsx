import React, { useRef, useEffect } from 'react'
import { Input } from '@headlessui/react'

const LetterTile = ({ letter, status, index, isActive, onLetterChange, onKeyDown }) => {
  const inputRef = useRef(null)

  // adds a focus to the input when the tile is active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  // gets the correct styles based on the status of the tile
  const getBackgroundColour = () => {
    if (status === 'empty') return 'bg-gray-400 border-gray-600'
    if (status === 2) return 'bg-green-600 border-green-600 text-white'
    if (status === 1) return 'bg-yellow-600 border-yellow-600 text-white'
    if (status === 0) return 'bg-gray-600 border-gray-600 text-white'
    return 'bg-white border-gray-400'
  }

  // current row tiles are rendered as inputs
  if (status === 'current') {
    return (
      <Input
        ref={inputRef}
        type='text'
        inputMode='text'
        maxLength='1'
        value={letter}
        onChange={(e) => onLetterChange(index, e.target.value)}
        onKeyDown={onKeyDown}
        className={`wordle-tile text-center ${getBackgroundColour()}`}
      />
    )
  }

  // past and future tiles are rendered as divs
  return (
    <div className={`wordle-tile ${getBackgroundColour()}`}>
      {letter}
    </div>
  )
}

export default LetterTile