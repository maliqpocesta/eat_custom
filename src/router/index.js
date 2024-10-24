import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import auth from 'src/api/auth'
import { usestoreAvailable } from "stores/storeAvailable";
import { useAuthStore } from "stores/AuthStore";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })


  Router.beforeEach(async (to, from, next) => {
    const ifstoreAvailable = usestoreAvailable();
    const AuthStore = useAuthStore();
    ifstoreAvailable.setLoading(true);

    if( to.meta.verifyToken){
      const respToken = await AuthStore.validateToken();
      if(respToken.code==1){
        next()
      } else {
        auth.logout();
        next({ path: '/login' })
      }
    } else if(!to.meta.requiresAuth || auth.authenticated()) {
      next()
    } else {
      next({ path: '/login' })
    }
  })

  Router.afterEach(() => {
    const ifstoreAvailable = usestoreAvailable();
    ifstoreAvailable.setLoading(false);
  });

  return Router
})
