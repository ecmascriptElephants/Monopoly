import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar'

const Nav = (props) => {
  return (
    <MuiThemeProvider>
      <Toolbar className='headers'>
        <ToolbarTitle text='Hackopoly' className='title' />
        <ToolbarTitle text={`Welcome ${window.localStorage.displayname}`} className='name' />
        <FlatButton label='Sign Out' primary className='signout' />
      </Toolbar>
    </MuiThemeProvider>
  )
}

export default Nav
