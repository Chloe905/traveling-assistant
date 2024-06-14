<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">
          Sign Up
        </h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="name">Name</label>
        <input id="name" v-model="name" name="name" type="text" class="form-control" placeholder="name"
          autocomplete="username" required autofocus>
      </div>

      <div class="form-label-group mb-2">
        <label for="email">Email</label>
        <input id="email" v-model="email" name="email" type="email" class="form-control" placeholder="email"
          autocomplete="email" required>
      </div>

      <div class="form-label-group mb-3">
        <label for="password">Password</label>
        <input id="password" v-model="password" name="password" type="password" class="form-control"
          placeholder="Password" autocomplete="new-password" required>
      </div>

      <div class="form-label-group mb-3">
        <label for="password-check">Password Check</label>
        <input id="password-check" v-model="passwordCheck" name="passwordCheck" type="password" class="form-control"
          placeholder="Password" autocomplete="new-password" required>
      </div>

      <button class="btn btn-lg btn-secondary btn-block mb-3" type="submit" :disabled="isProcessing">
        Submit
      </button>

      <div class="text-center mb-3">
        <p>
          <router-link to="/signin">
            Sign In
          </router-link>
        </p>
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
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
      isProcessing: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleSubmit () {
      this.isProcessing = true
      // Check if any field is empty
      if (!this.name || !this.email || !this.password || !this.passwordCheck) {
        alert('Please fill in all fields')
        this.isProcessing = false
        return
      }

      // Stop form submission if passwords don't match
      if (this.password !== this.passwordCheck) {
        alert('Passwords do not match')
        this.isProcessing = false
        return
      }

      const data = {
        name: this.name,
        email: this.email,
        password: this.password
      }

      try {
        await authorizationAPI.signUp(data)
        
        alert('Sign up successful! Please log in.')
        this.$router.push('/signin')
      } catch (error) {
        this.isProcessing = false
        console.error('Error Sign up:', error)
        alert('Sign Up Failed.')
      } finally {
        this.isProcessing = false
      }
    }
  }
}
</script>