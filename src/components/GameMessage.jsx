import React from 'react'

const GameMessage = ({ text, type = 'info' }) => {
  if (!text) return <div className="h-12"></div>

  // sets the background colour based on the type of message
  const getBackgroundColour = () => {
    switch (type) {
      case 'won':
        return 'bg-green-600'
      case 'warning':
        return 'bg-yellow-600'
      case 'lost':
        return 'bg-red-800'
      default:
        return 'bg-gray-800'
    }
  }

  return (
    <div className={`h-12 mt-2 px-6 py-3 ${getBackgroundColour()} text-white rounded-md shadow-lg text-center text-xl`}>
      {text}
    </div>
  )
}

export default GameMessage