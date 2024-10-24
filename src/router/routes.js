
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'home', component: () => import('pages/Home.vue') },
      { path: 'orders', component: () => import('pages/Orders.vue'), meta: { requiresAuth: true } },
      { path: 'signup', component: () => import('pages/Signup.vue') },
      { path: 'guest', component: () => import('pages/GuestSignup.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'forgotpassword', component: () => import('pages/ForgotPassword.vue') },
      { path: 'resetpassword', component: () => import('pages/ResetPassword.vue') },
      { path: 'location', component: () => import('pages/Location.vue') },
      { path: 'checkout', component: () => import('pages/Checkout.vue'), meta: { requiresAuth: true } },
      { path: 'cart', name: 'cart', component: () => import('pages/CartPage.vue') },
      { path: 'page/:slug', name: 'page', props: true, component: () => import('pages/CustomPage.vue') }
    ]
  },
  {
    path: '/menu',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'menu', props: true, component: () => import('pages/Menu.vue') },
      { path: 'search', name: 'menusearch', props: true, component: () => import('pages/SearchProduct.vue') },
      { path: 'product/:slug/:cat_id/:item_uuid', name: 'product', props: true, component: () => import('pages/Product.vue') }
    ]
  },
  {
    path: '/account',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Profile.vue') },
      { path: 'menu', component: () => import('pages/AccountMenu.vue'), meta: { requiresAuth: false } },
      { path: 'profile', component: () => import('pages/Profile.vue'), meta: { requiresAuth: true, verifyToken: true } },
      { path: 'orders', component: () => import('pages/Orders.vue'), meta: { requiresAuth: true , verifyToken: true} },
      { path: 'change-password', component: () => import('pages/ChangePassword.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'addresses', component: () => import('pages/Addresses.vue'), meta: { requiresAuth: true,verifyToken: true } },
      { path: 'address-new', component: () => import('pages/AddressesNew.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'payments', component: () => import('pages/Payments.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'payments/new', component: () => import('pages/PaymentNew.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'favourites', component: () => import('pages/Favourites.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'trackorder', component: () => import('pages/TrackOrder.vue'), meta: { requiresAuth: true } },
      { path: 'verify', component: () => import('pages/AccountVerify.vue') },
      { path: 'complete-registration', component: () => import('pages/CompleteRegistration.vue') },
      { path: 'points', component: () => import('pages/PointPage.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'wallet', component: () => import('pages/WalletPage.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'chat', component: () => import('pages/ChatPage.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'chat/conversation', component: () => import('pages/ChatConversation.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'orders/upload-deposit', component: () => import('pages/UploadDeposit.vue'), meta: { requiresAuth: true ,verifyToken: true } },
      { path: 'bookings', component: () => import('pages/BookingPage.vue'), meta: { requiresAuth: true ,verifyToken: true } },
    ]
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SearchItem.vue') }
    ]
  },

  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AboutUs.vue') }
    ]
  },

  {
    path: '/reservation',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/TableReservation.vue') },
      { path: 'track', name : 'track-reservation', component: () => import('pages/TrackReservation.vue') },
      { path: 'cancel', name : 'reservation-cancel', component: () => import('pages/TableCancel.vue') },
      { path: 'update', name : 'reservation-update', component: () => import('pages/TableReservation.vue') }
    ]
  },



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  }
]

export default routes
