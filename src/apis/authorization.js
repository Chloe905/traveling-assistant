import { apiHelper } from '../utils/helper.js'

export default {
  signIn({ email, password }) {
    return apiHelper.post('/signin', {
      email,
      password
    })
  },
  signUp({ name, email, password }) {
    return apiHelper.post('/users', {
      name,
      email,
      password
    })
  }
}
