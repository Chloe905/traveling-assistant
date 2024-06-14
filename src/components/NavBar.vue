<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand ms-4" to="/trips">
        Travel Assistant
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <template v-if="isAuthenticated && user">
            <li class="nav-item">
              <router-link to="#" class="nav-link text-white me-3">
                Hi {{ user.name }}
              </router-link>
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-sm btn-outline-light my-2 my-sm-1 ms-2" @click="handleLogout">
                LogOut
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link to="/signin" class="btn btn-sm btn-outline-light ms-2 my-2 my-sm-0">
                LogIn
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/signup" class="btn btn-sm btn-outline-secondary my-2 my-sm-1 ms-2">
                SignUp
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['isAuthenticated', 'user'])
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout () {
      this.logout()
      this.$router.push('/signin')
    }
  }
}
</script>

<style>
.navbar-nav .nav-item {
  display: flex;
  align-items: center;
}
</style>
