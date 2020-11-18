import './AppPage.scss'
import React, { useState, useEffect } from 'react'
import Business from 'components/Business'
import GameSettings from 'settings/gameSettings'

const AppPage = () => {

  const summary = JSON.parse(localStorage.getItem('summary')) || 0

  const [sumValue, setSumValue] = useState(summary)

  useEffect(() => {
    localStorage.setItem('summary', sumValue)
  }, [sumValue])

  const addSumValue = (value) => {
    setSumValue(sumValue => sumValue + value)
  }

  const renderBusinesses = () => {
    const { businesses } = GameSettings
    return businesses.map((business, index) => (
      <Business
        key={index}
        initStats={business}
        sumValue={sumValue}
        addSumValue={addSumValue}
      />
    ))
  }

  return (
    <div className="app-page">
      <p className="sum-value">{sumValue}$</p>
      <div className="businesses-container">
        { renderBusinesses() }
      </div>
    </div>
  )}

export default AppPage
