import { useState, useCallback } from 'react'
import GameBoard from './components/GameBoard'
import GameMessage from './components/GameMessage'
import { WORD_LENGTH, MAX_GUESSES, API_URL } from './constants/constants'

function App() {
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''))
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0)
  const [scores, setScores] = useState(Array(MAX_GUESSES).fill([]))
  const [currentGuess, setCurrentGuess] = useState('')
  const [message, setMessage] = useState({ text: '', type: 'default' })
  const [gameState, setGameState] = useState('playing')

  // handles the letter change in the current guess and creates the new guess string
  const handleLetterChange = (index, value) => {
    if (/^[a-zA-Z]?$/.test(value)) {
      const newGuess = currentGuess.split('')

      newGuess[index] = value.toLowerCase()

      setCurrentGuess(newGuess.join(''))
    }
  }

  const handleKeyDown = (e) => {
    // if player presses Backspace with an empty input, move to previous tile and remove the letter
    if (e.key === 'Backspace' && e.target.value === '' && e.target.previousSibling) {
      e.preventDefault()
      e.target.previousSibling.focus()

      const newGuess = currentGuess.slice(0, -1)
      setCurrentGuess(newGuess)
    }
    // if player types a letter, move to next tile if able
    else if (/^[a-zA-Z]$/.test(e.key) && e.target.nextSibling) {
      setMessage({ text: '', type: 'default' })
      e.target.nextSibling.focus()
    }
    // when player presses Enter, submit the guess
    else if (e.key === 'Enter') {
      e.preventDefault()
      submitGuess()
    }
  }

  const submitGuess = useCallback(async () => {
    // check if the current guess has 5 letters
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage({ text: `Word must be ${WORD_LENGTH} letters`, type: 'warning' })
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guess: currentGuess })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      const { is_valid_word, score } = data

      // check if the word is valid based on the API response
      if (!is_valid_word) {
        setMessage({ text: 'Not a valid word', type: 'warning' })
        return
      }

      const newGuesses = [...guesses]
      newGuesses[currentGuessIndex] = currentGuess
      setGuesses(newGuesses)

      const newScores = [...scores]
      newScores[currentGuessIndex] = score
      setScores(newScores)

      // check if the player has won
      if (score.every(s => s === 2)) {
        setGameState('won')

        setMessage({ text: 'Congratulations! You won!', type: 'won' })
        return
      }

      // if the player didn't win, move to the next guess or game over
      if (currentGuessIndex < MAX_GUESSES - 1) {
        setCurrentGuessIndex(currentGuessIndex + 1)
        setCurrentGuess('')
      } else {
        setGameState('lost')
        setMessage({ text: 'Game over! You should try again!', type: 'lost' })
      }
    } catch (error) {
      console.error('Error validating word:', error)
      setMessage({ text: 'Error validating guess. Please try again.', type: 'warning' })
    }
  }, [currentGuess, currentGuessIndex, guesses, scores])

  // resets the game state to the initial state
  const resetGame = () => {
    setGuesses(Array(MAX_GUESSES).fill(''))
    setScores(Array(MAX_GUESSES).fill([]))
    setCurrentGuessIndex(0)
    setCurrentGuess('')
    setGameState('playing')
    setMessage({ text: '', type: 'default' })
  }

  return (
    <div className='flex flex-col items-center min-h-screen bg-sky-900 p-7'>
      <h1 className='text-6xl justify-center font-mono font-bold tracking-wider mb-8 text-blue-500'>WORDLE</h1>

      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        currentGuessIndex={currentGuessIndex}
        scores={scores}
        gameState={gameState}
        onLetterChange={handleLetterChange}
        onKeyDown={handleKeyDown}
      />

      <GameMessage text={message.text} type={message.type} />

      {gameState !== 'playing' && (
        <button
          className='mt-8 px-4 py-2 bg-blue-500 font-mono text-white rounded hover:bg-blue-600'
          onClick={resetGame}
        >
          Play Again
        </button>
      )}
    </div>
  )
}

export default App