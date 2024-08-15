<template>
  <v-app>
    <div class="app">
      <template v-if="shouldRenderComponents"> <!-- Render sidebar and header if not on login page or if authenticated -->
        <Sidebar v-if="isAuthenticated" />
        <div class="headerAndContent">
          <Header v-if="isAuthenticated" />
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <Component :is="Component" />
            </transition>
          </router-view>
        </div>
      </template>
      <template v-else>
        <!-- Render only the login page content -->
        <router-view />
      </template>
    </div>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      isAuthenticated: false,
    };
  },
  computed: {
    shouldRenderComponents() {
      return !this.isLoginPage || this.isAuthenticated;
    },
    isLoginPage() {
      // Check if the current route is the login page
      return this.$route.path === '/login';
    },
  },
  watch: {
    '$route'() {
      // Update authentication status whenever route changes
      this.isAuthenticated = this.checkAuthentication();
    },
  },
  created() {
    // Check authentication status on component creation
    this.isAuthenticated = this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      // Check if the user is authenticated
      const token = sessionStorage.getItem('token');
      return token !== null; // Check if token exists
    },
  },
};
</script>

<style lang="scss" >
:root {
--primary: #727885;
--grey:#64748b;
--dark:#2F3F64;
--dark-alt: #334155;
--light:#cdd1da;
--sidebar-width:285px;
--header-height: 80px

}

* {
margin: 0;
padding: 0;
box-sizing: border-box;
font-family: 'Inter';
}

body {
background: #e2e2e2;
}

button {
cursor: pointer;
appearance: none;
border: none;
outline: none;
background: none;
}

.app {
display:flex;
main {
  flex: 1 1 0;
  padding: 2rem;
  will-change: transform, opacity;

  @media (max-width: 1050px){
      justify-content: center;
      flex-wrap: wrap;
      margin: 0;
      flex-direction: column;
    
      .left-container {
        flex: 1;

        .top-left{
          border-right: 4px solid var(--dark-alt);
        }

        .bottom-left{
          border-right: 4px solid var(--dark-alt);
        }

        .pending-table{
          border-right: 4px solid var(--dark-alt);

        }

      }
        .right-container {
          flex: 1;

        .vmg{
          border-left: 4px solid var(--dark-alt);

        }

        .profile{
          border-left: 4px solid var(--dark-alt);

        }


        }
      .bottom-container{
        flex-direction: column;
      }
  }
}
.headerAndContent {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}    

}
</style>