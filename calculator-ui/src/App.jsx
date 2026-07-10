import { useState } from 'react'
import './App.css'

function calculate(a, operator, b) {
  switch (operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      if (b === 0) throw new Error('Cannot divide by zero')
      return a / b
    default:
      throw new Error(`Unsupported operator: ${operator}`)
  }
}

function formatResult(value) {
  if (!Number.isFinite(value)) return 'Error'
  const rounded = Math.round(value * 1e10) / 1e10
  return String(rounded)
}

const MAX_DIGITS = 12

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [error, setError] = useState(null)

  function inputDigit(digit) {
    setError(null)
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }
    if (display === '0') {
      setDisplay(digit)
    } else if (display.replace('-', '').replace('.', '').length < MAX_DIGITS) {
      setDisplay(display + digit)
    }
  }

  function inputDecimal() {
    setError(null)
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  function clearAll() {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setError(null)
  }

  function toggleSign() {
    if (display === '0') return
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)
  }

  function inputPercent() {
    const value = parseFloat(display)
    setDisplay(formatResult(value / 100))
  }

  function performOperation(nextOperator) {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator && !waitingForOperand) {
      try {
        const result = calculate(previousValue, operator, inputValue)
        setDisplay(formatResult(result))
        setPreviousValue(result)
        setError(null)
      } catch (e) {
        setError(e.message)
        setDisplay('Error')
        setPreviousValue(null)
        setOperator(null)
        setWaitingForOperand(true)
        return
      }
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  function handleEquals() {
    if (operator === null || previousValue === null) return
    const inputValue = parseFloat(display)
    try {
      const result = calculate(previousValue, operator, inputValue)
      setDisplay(formatResult(result))
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
      setError(null)
    } catch (e) {
      setError(e.message)
      setDisplay('Error')
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
    }
  }

  return (
    <div className="calculator">
      <div className="display" data-testid="display">
        {error && <div className="error">{error}</div>}
        <div className="display-value">{display}</div>
      </div>
      <div className="keypad">
        <button className="key key-function" onClick={clearAll}>
          {display !== '0' || previousValue !== null ? 'C' : 'AC'}
        </button>
        <button className="key key-function" onClick={toggleSign}>
          ±
        </button>
        <button className="key key-function" onClick={inputPercent}>
          %
        </button>
        <button
          className={`key key-operator ${operator === '÷' && waitingForOperand ? 'active' : ''}`}
          onClick={() => performOperation('÷')}
        >
          ÷
        </button>

        <button className="key" onClick={() => inputDigit('7')}>7</button>
        <button className="key" onClick={() => inputDigit('8')}>8</button>
        <button className="key" onClick={() => inputDigit('9')}>9</button>
        <button
          className={`key key-operator ${operator === '×' && waitingForOperand ? 'active' : ''}`}
          onClick={() => performOperation('×')}
        >
          ×
        </button>

        <button className="key" onClick={() => inputDigit('4')}>4</button>
        <button className="key" onClick={() => inputDigit('5')}>5</button>
        <button className="key" onClick={() => inputDigit('6')}>6</button>
        <button
          className={`key key-operator ${operator === '-' && waitingForOperand ? 'active' : ''}`}
          onClick={() => performOperation('-')}
        >
          −
        </button>

        <button className="key" onClick={() => inputDigit('1')}>1</button>
        <button className="key" onClick={() => inputDigit('2')}>2</button>
        <button className="key" onClick={() => inputDigit('3')}>3</button>
        <button
          className={`key key-operator ${operator === '+' && waitingForOperand ? 'active' : ''}`}
          onClick={() => performOperation('+')}
        >
          +
        </button>

        <button className="key key-zero" onClick={() => inputDigit('0')}>0</button>
        <button className="key" onClick={inputDecimal}>.</button>
        <button className="key key-operator key-equals" onClick={handleEquals}>
          =
        </button>
      </div>
    </div>
  )
}

export default App
