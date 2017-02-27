module.exports = {
  isAuth: () => {
    if (window.localStorage.token) {
      return true
    } else {
      return false
    }
  }
}
