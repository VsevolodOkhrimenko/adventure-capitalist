import './Timer.scss'
import React from 'react'
import { pad } from 'helpers/common'

class Timer extends React.Component {
  constructor(props) {
    super()
    this.state = {
      time: {},
      mseconds: props.time || 0,
      transitionTime: 0,
      width:  0
    }
    this.timer = 0
    this.startTimer = this.startTimer.bind(this)
    this.countDown = this.countDown.bind(this)
  }

  secondsToTime(msecs) {
    let hours = Math.floor(msecs / (60 * 60 * 1000))
    let divisor_for_minutes = msecs % (60 * 60 * 1000)
    let minutes = Math.floor(divisor_for_minutes / (60 * 1000))
    let divisor_for_seconds = divisor_for_minutes % (60 * 1000)
    let seconds = Math.floor(divisor_for_seconds / 1000)

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    }
    return obj
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.mseconds)
    this.setState({
      time: timeLeftVar,
      width: 0,
      transitionTime: 0
    })
  }

  componentWillUnmount() {
    this.resetTimer()
  }

  setStats(speed, width) {
    clearInterval(this.timer)
    this.setState({
      time: this.secondsToTime(speed),
      mseconds: speed,
      transitionTime: 100,
      width: width
    })
    if (this.timer === 0 && this.state.mseconds > 300) {
      this.timer = setInterval(this.countDown, 100)
    }
  }

  startTimer() {
    this.resetTimer()
    if (this.timer === 0 && this.state.mseconds > 300) {
      this.timer = setInterval(this.countDown, 100)
      this.setState({
        width: 0,
        transitionTime: 100
      })
    }
  }

  resetTimer() {
    clearInterval(this.timer)
    this.timer = 0
    const mseconds = this.props.time || 0
    this.setState({
      time: this.secondsToTime(mseconds),
      mseconds: mseconds,
      transitionTime: 0,
      width: 0
    })
  }

  countDown() {
    let mseconds = this.state.mseconds - 100 // minus 1 iteration
    const percent = (this.props.time - mseconds + 200) / (this.props.time) * 100 // percent + 2 iterations
    this.setState({
      time: this.secondsToTime(mseconds),
      mseconds: mseconds,
      width: percent,
    })
    if (mseconds <= 100) {
      clearInterval(this.timer)
      this.resetTimer()
    }
  }

  render() {
    return(
      <div className="progress-bar-container">
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{
              width: `${this.state.width}%`,
              transition: `${this.state.transitionTime}ms linear`
            }}
          >
          </div>
          <div className="profit">
            {this.props.profit}$
          </div>
        </div>
        <div className="timer">
          <div className="timer-inner">
            {pad(this.state.time.h)}:{pad(this.state.time.m)}:{pad(this.state.time.s)}
          </div>
        </div>
      </div>
    )
  }
}

export default Timer
