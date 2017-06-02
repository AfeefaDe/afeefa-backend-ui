import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/routes/Login'
import Protected from '@/components/routes/Protected'
import Dashboard from '@/components/routes/Dashboard'
import Todos from '@/components/routes/Todos'

import ListOrgas from '@/components/routes/orgas/List'
import NewOrga from '@/components/routes/orgas/New'
import EditOrga from '@/components/routes/orgas/Edit'
import ShowOrga from '@/components/routes/orgas/Show'

import ListEvents from '@/components/routes/events/List'
import NewEvent from '@/components/routes/events/New'
import EditEvent from '@/components/routes/events/Edit'
import ShowEvent from '@/components/routes/events/Show'

import Search from '@/components/routes/Search'
import Translations from '@/components/routes/Translations'
import NotFound from '@/components/routes/NotFound'

import store from '@/store'

const routes = [
  {
    path: '/',
    component: Protected,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'todos',
        name: 'todos',
        component: Todos
      },
      {
        path: 'orgas',
        component: { template: '<router-view></router-view>' },
        children: [
          {
            path: '',
            name: 'orgas.list',
            component: ListOrgas
          },
          {
            path: 'new',
            name: 'orgas.new',
            component: NewOrga
          },
          {
            path: ':id',
            name: 'orgas.show',
            component: ShowOrga,
            props: true
          },
          {
            path: ':id/edit',
            name: 'orgas.edit',
            component: EditOrga,
            props: true
          }
        ]
      },
      {
        path: 'events',
        component: { template: '<router-view></router-view>' },
        children: [
          {
            path: '',
            name: 'events.list',
            component: ListEvents,
            children: [
              {
                path: 'past',
                name: 'events.past',
                component: ListEvents
              }
            ]
          },
          {
            path: 'new',
            name: 'events.new',
            component: NewEvent
          },
          {
            path: ':id',
            name: 'events.show',
            component: ShowEvent,
            props: true
          },
          {
            path: ':id/edit',
            name: 'events.edit',
            component: EditEvent,
            props: true
          }
        ]
      },
      {
        path: 'search',
        name: 'search',
        component: Search
      },
      {
        path: 'translations',
        name: 'translations',
        component: Translations
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFound
  }
]


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.name === 'notfound') {
    store.dispatch('messages/showAlert', {
      isError: true,
      description: `Die eigentliche Seite "${to.path}" konnte nicht gefunden werden.\nWeiterleitung zum Dashboard veranlasst.`,
      autoHide: false
    })
    next({name: 'dashboard'})
  } else {
    next()
  }
})

export default router
