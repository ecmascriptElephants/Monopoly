import React from 'react'
import { Redirect } from 'react-router-dom'
import { Dimmer, Loader, Image } from 'semantic-ui-react'
class Loading extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect: false
    }

    this.changeLink = this.changeLink.bind(this)
  }

  changeLink () {
    this.setState({redirect: true})
  }
  render () {
    setTimeout(this.changeLink, 10000)
    return (
      <Dimmer active inverted>
        {this.state.redirect ? <Redirect to={{ pathname: '/board' }} /> : null}
        <Loader inverted> Loading </Loader>
        <Image id='left' src='/JoeArtistic.gif' />
        <Image id='right' src='/JoeBusiness.gif' />
        <Image src='/JoeGangnam.gif' />
        <Image id='hmm' src='/JoeTricycle.gif' />
      </Dimmer>
    )
  }
}

export default Loading
