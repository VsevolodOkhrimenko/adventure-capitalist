import './Business.scss'
import React, { useState, useEffect, useRef } from 'react'
import Timer from 'components/Timer'


const Business = ({ initStats, timestap, sumValue, addSumValue }) => {

  const {
    id,
    name,
    managerCost,
    businessCost,
    upgradeCostMultiplier,
    levelUpMultiplier
  } = initStats

  const progress = JSON.parse(localStorage.getItem(id)) || initStats

  const [speed, setSpeed] = useState(initStats['speed'])
  const [value, setValue] = useState(progress['value'])
  const [level, setLevel] = useState(progress['level'])
  const [hasManager, setHasManager] = useState(progress['hasManager'])
  const [bought, setBought] = useState(progress['bought'])
  const [iterationStart, setIterationStart] = useState(progress['iterationStart'])
  const timer = useRef(0)
  const childRef = useRef()
  const speedRef = useRef(speed)
  const levelRef = useRef(level)
  const valueRef = useRef(value)
  const hasManagerRef = useRef(hasManager)
  const boughtRef = useRef(bought)
  const iterationStartRef = useRef(iterationStart)

  useEffect(() => {
    window.addEventListener('beforeunload', saveProgress)
    if (progress['iterationStart']) {
      const diff = new Date().getTime() - progress['iterationStart']
      let iterations = 0
      if (diff > speed) {
        iterations = diff / speed
      }
      if (progress['hasManager']) {
        console.log(`From business ${name} added ${parseInt(iterations) * progress['value']}$`)
        addSumValue(parseInt(iterations) * progress['value'])
        const remainingPercent = parseFloat(((diff / speed) % 1))
        if (remainingPercent) {
          const remainingSpeed = speed - (speed * remainingPercent)
          childRef.current.setStats(remainingSpeed, remainingPercent * 100)
          speedRef.current = remainingSpeed
          
        }
      } else if ((new Date().getTime() - progress['timestap']) / speed > 1) {
        console.log(`From business ${name} added ${progress['value']}$`)
        addSumValue(progress['value'])
      } else if ((new Date().getTime() - progress['timestap']) / speed < 1) {
        const remainingPercent = parseFloat(((diff / speed) % 1))
        if (remainingPercent) {
          const remainingSpeed = speed - (speed * remainingPercent)
          childRef.current.setStats(remainingSpeed, remainingPercent * 100)
          speedRef.current = remainingSpeed
          handleIteration()
        }
      }
    }
    return () => {
      clearInterval(timer.current)
      timer.current = 0
      window.removeEventListener('beforeunload', saveProgress)
    }
  }, [])


  useEffect(() => {
    saveProgress()
  }, [value, bought, hasManager, iterationStart, level])


  const saveProgress = () => {
    const currentProgress = {
      'level': levelRef.current,
      'value': valueRef.current,
      'hasManager': hasManagerRef.current,
      'bought': boughtRef.current,
      'iterationStart': iterationStartRef.current,
      'timestap': new Date().getTime()
    }
    localStorage.setItem(id, JSON.stringify(currentProgress))
  }

  const upgradeBusiness = () => {
    addSumValue(-value * upgradeCostMultiplier)
    setValue(value => Math.ceil(value * levelUpMultiplier))
    valueRef.current = Math.ceil(value * levelUpMultiplier)
    setLevel(level => level + 1)
    levelRef.current = level + 1
  }

  const buyManager = () => {
    setHasManager(true)
    hasManagerRef.current = true
    addSumValue(-managerCost)
  }

  const buyBusiness = () => {
    setBought(true)
    boughtRef.current = true
    addSumValue(-businessCost)
  }

  const handleIteration = () => {
    if (speedRef.current === initStats['speed']) {
      childRef.current.startTimer()
      setIterationStart(new Date().getTime())
      iterationStartRef.current = new Date().getTime()
    }
    timer.current = setTimeout(() => {
        clearTimeout(timer)
        timer.current = 0
        addSumValue(value)
        setIterationStart(0)
        iterationStartRef.current = 0
        if (speedRef.current !== initStats['speed']) {
          setSpeed(initStats['speed'])
          speedRef.current = initStats['speed']
        }
        if (hasManagerRef.current) {
          iteration()
        }
      }, speedRef.current)
  }

  function iteration() {
    if (hasManagerRef.current && timer.current === 0) {
      if (speedRef.current === initStats['speed']) {
        childRef.current.startTimer()
        setIterationStart(new Date().getTime())
        iterationStartRef.current = new Date().getTime()
      }
      timer.current = setInterval(() => {
        addSumValue(valueRef.current)
        childRef.current.startTimer()
        setIterationStart(new Date().getTime())
        iterationStartRef.current = new Date().getTime()
        if (speedRef.current !== initStats['speed']) {
          setSpeed(initStats['speed'])
          speedRef.current = initStats['speed']
          clearInterval(timer.current)
          timer.current = 0
          iteration()
        }
      }, speedRef.current)
    }
  }

  useEffect(() => {
    iteration()
  }, [childRef, hasManager])

  return bought ? (
    <div id={id} className="business">
      <h3>{name}</h3>
      {
        hasManager ?
        null :
        <button
          className={`action-btn ${iterationStart ? 'disable' : ''}`}
          onClick={iterationStart ? null : () => handleIteration()}
        >
          Start
        </button>
      }
        <Timer ref={childRef} time={speed} profit={value} />
        <button
          onClick={sumValue >= value * 3 ? upgradeBusiness : null}
          className={`action-btn ${sumValue >= value * 3 ? '' : 'disable'}`}
        >
          {value * upgradeCostMultiplier}$ Upgrade (Level {level})
        </button>
        {hasManager ?
          null :
          <div>
            <button
              className={`action-btn ${sumValue >= managerCost ? '' : 'disable'}`}
              onClick={ sumValue >= managerCost ? buyManager : null}
            >
              {managerCost}$ Buy manager
            </button>
          </div>
        }
    </div>
  ) : (
    <div className="business">
      <h3>{name}</h3>
      <button
        className={`action-btn ${sumValue >= businessCost ? '' : 'disable'}`}
        onClick={ sumValue >= businessCost ? buyBusiness : null }
      >
        {businessCost}$ Buy
      </button>
    </div>
  )}

export default Business
