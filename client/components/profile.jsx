import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider, Form } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Authenticate from '../helper/authenticate'
class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      queryResults: []
    }
    this.getChats = this.getChats.bind(this)
  }

  getChats (e) {
    e.preventDefault()
    let room = document.getElementById('room').value
    let keyword = document.getElementById('keyword').value
    let date = document.getElementById('date').value
    document.getElementById('keyword').value = ''
    axios.post('/chats', { room: room, keyword: keyword, date: date })
      .then((res) => {
        this.setState({ queryResults: res.data })
      })
      .catch((err) => console.error(err))
  }

  render () {
    let queryResults = this.state.queryResults.map((result) => {
      return <li>Sender: {result.sender} Message: {result.message} Room: {result.room}</li>
    })
    return (
      <div className='container'>
        <h1>Search your chats!</h1>
        <form onSubmit={this.getChats}>
          <input type='text' placeholder='keyword' id='keyword' />
          <select id='room' name='room'>
            <option>All Rooms</option>
            <option value='lobby'>Lobby</option>
            <option value='board'>Board</option>
          </select>

          <select id='date'>
            <option>This Week</option>
            <option value='thisWeek'>This Month</option>
            <option value='thisYear'>This Year</option>
          </select>
          <button type='submit'>Show chats</button>
        </form>
        <p> You have total of {this.state.queryResults.length} messages </p>
        <ul>
          {queryResults}
        </ul>
      </div>
    )
  }
}

export default Profile
