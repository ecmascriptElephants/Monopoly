import axios from 'axios'

module.exports = {
  isAuth: () => {
    const returnFalseFunc = () => {
      console.log('hello')
      return false
    }

    const returnTrueFunc = () => {
      console.log('hello')
      return true
    }
    if (window.localStorage.token) {
      axios.post('/tokenauth', { token: window.localStorage.token })
      .then((res) => {
        if (res.data.validToken) {
          console.log('the token from the routes side is valid; = ', res.data.validToken)
          returnTrueFunc()
        } else {
          returnFalseFunc()
        }
      })
      .catch((err) => {
        returnFalseFunc()
        console.error(err)
      })
    } else {
      console.log('in authenticate.js there is no token')
      return false
    }
  }
}
