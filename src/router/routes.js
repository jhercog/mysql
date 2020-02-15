
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/pgIndex.vue') },
      { path: 'kalendar', name: 'Kalendar', component: () => import('pages/pgKalendar.vue') },
      { path: 'molitvenik', name: 'Molitvenik', component: () => import('pages/pgMolitvenik.vue') },
      { path: 'blagdani', name: 'Blagdani', component: () => import('pages/pgBlagdani.vue') },
      // { path: '', component: () => import('pages/pgDnevnica.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
