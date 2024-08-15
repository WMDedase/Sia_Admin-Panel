import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      redirect: '/login' // Redirect root path to login
    },
    {
      path: '/login',
      component: () => import('../views/StudentLogin.vue'),
      // meta: {
      //   requiresAuthentication: false, // Set to false for login page
      // },
    },
    {
      path: '/dashboard',
      component: () => import('../views/Dashboard.vue'),
      // meta: {
      //   requiresAuthentication: false, 
      // },
    },
    {
      path: '/accounts',
      component: () => import('../views/Accounts.vue'),
      // meta: {
      //   requiresAuthentication: false, 
      // },
    },
    {
      path: '/sectionadding',
      component: () => import('../views/SectionAdding.vue'),
      // meta: {
      //   requiresAuthentication: false, 
      // },
    },
    {
      path: '/resetschoolyear',
      component: () => import('../views/ResetSchoolYear.vue'),
      // meta: {
      //   requiresAuthentication: false, 
      // },
    },

  ]
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuthentication) {
//     const token = getToken(); // Get token from sessionStorage
//     if (!token) {
//       next('/login');
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

// function getToken() {
//   // Retrieve the token from sessionStorage
//   return sessionStorage.getItem('token');
// }

export default router;
