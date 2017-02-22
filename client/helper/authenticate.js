module.exports = {
  isAuth: () => {
    if (localStorage.token) {
      return true
    } else {
      return false
    }
  }
}