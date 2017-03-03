import React from 'react'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'

const Nav = (props) => {

return (
     <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      </MuiThemeProvider>
)
}


export default Nav