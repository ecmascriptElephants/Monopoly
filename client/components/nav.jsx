import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import { Toolbar, ToolbarTitle } from 'material-ui/Toolbar'

const Nav = (props) => {
  return (
    <MuiThemeProvider>
      <Toolbar className='headers'>
        <ToolbarTitle text='HACKOPOLY' className='title' />
        <ToolbarTitle text={`WELCOME ${window.localStorage.displayname.toUpperCase()}`} className='name' />
        <FlatButton label='SIGN OUT' primary className='signout' />
      </Toolbar>
    </MuiThemeProvider>
  )
}

export default Nav
