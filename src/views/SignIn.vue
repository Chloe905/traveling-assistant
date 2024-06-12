<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">
          Sign In
        </h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="email">email</label>
        <input id="email" v-model="email" name="email" type="email" class="form-control" placeholder="email"
          autocomplete="username" required autofocus>
      </div>

      <div class="form-label-group mb-3">
        <label for="password">Password</label>
        <input id="password" v-model="password" name="password" type="password" class="form-control"
          placeholder="Password" autocomplete="current-password" required>
      </div>

      <button class="btn btn-lg btn-primary btn-block mb-3" type="submit" :disabled="isProcessing">
        Submit
      </button>

      <div class="text-center mb-3">
        <router-link to="/signup">
          Sign Up
        </router-link>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">
        &copy; 2024
      </p>
    </form>
  </div>
</template>

<script>
import authorizationAPI from '../apis/authorization'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      isProcessing: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleSubmit () {
      this.isProcessing = true

      try {
        const response = await authorizationAPI.signIn({
          email: this.email,
          password: this.password
        })

        const { data: loginData } = response
        const token = response?.data?.accessToken
        const user = response?.data?.user
        if (token && user) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))

          this.login(loginData.user)
          this.$router.push('/trips')
        }
      } catch (error) {
        this.isProcessing = false
        console.error('Error logging in:', error)
        alert('Sign in failed. Please check your credentials.')
      }
    }
  }
}
</script>