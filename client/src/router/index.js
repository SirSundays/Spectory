import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import AdminTest from "../views/AdminTest.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      requiresBasicAuth: true
    }
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminTest,
    meta: {
      requiresAdvancedAuth: true
    }
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/register.vue")
  }
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
const axios = require('axios');
const base_url = "http://localhost:4000";

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresBasicAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/"
      });
    } else {
      let role = localStorage.getItem("jwt").role;
      if (role === 1 || role === 42) {
        next();
      }
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresBasicAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/"
      });
    } else {
      let role = localStorage.getItem("jwt").role;
      if (role === 42) {
        next();
      }
    }
  } else {
    next();
  }
});
export default router;