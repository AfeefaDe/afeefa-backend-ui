import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/routes/Login'
import Protected from '@/components/routes/Protected'
import Dashboard from '@/components/routes/Dashboard'
import Todos from '@/components/routes/Todos'

import ListOffers from '@/components/routes/offers/List'
import NewOffer from '@/components/routes/offers/New'
import ShowOffer from '@/components/routes/offers/Show'
import EditOffer from '@/components/routes/offers/Edit'
import ConvertFromActor from '@/components/routes/offers/Convert'

import ListOrgas from '@/components/routes/orgas/List'
import NewOrga from '@/components/routes/orgas/New'
import EditOrga from '@/components/routes/orgas/Edit'
import ShowOrga from '@/components/routes/orgas/Show'

import EditContact from '@/components/routes/contacts/Edit'
import NewContact from '@/components/routes/contacts/New'

import ListEvents from '@/components/routes/events/List'
import NewEvent from '@/components/routes/events/New'
import EditEvent from '@/components/routes/events/Edit'
import ShowEvent from '@/components/routes/events/Show'

import ListChapters from '@/components/routes/chapters/List'
import NewChapter from '@/components/routes/chapters/New'
import EditChapter from '@/components/routes/chapters/Edit'

import ShowNavigation from '@/components/routes/navigation/Show'
import ShowFacets from '@/components/routes/facets/Show'

import Search from '@/components/routes/Search'
import UserSettings from '@/components/routes/UserSettings'

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
        path: 'offers',
        component: { template: '<router-view></router-view>' },
        children: [
          {
            path: '',
            name: 'offers.list',
            component: ListOffers
          },
          {
            path: 'new',
            name: 'offers.new',
            component: NewOffer
          },
          {
            path: 'convert',
            name: 'offers.convert',
            component: ConvertFromActor
          },
          {
            path: ':id',
            component: { template: '<router-view></router-view>' },
            children: [
              {
                path: '',
                name: 'offers.show',
                component: ShowOffer,
                props: true
              },
              {
                path: 'contacts/:contactId/edit',
                name: 'offers.contactedit',
                component: EditContact,
                props: true
              },
              {
                path: 'contacts/new',
                name: 'offers.contactnew',
                component: NewContact,
                props: true
              }
            ]
          },
          {
            path: ':id/edit',
            name: 'offers.edit',
            component: EditOffer,
            props: true
          }
        ]
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
            component: { template: '<router-view></router-view>' },
            children: [
              {
                path: '',
                name: 'orgas.show',
                component: ShowOrga,
                props: true
              },
              {
                path: 'contacts/:contactId/edit',
                name: 'orgas.contactedit',
                component: EditContact,
                props: true
              },
              {
                path: 'contacts/new',
                name: 'orgas.contactnew',
                component: NewContact,
                props: true
              }
            ]
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
                path: 'upcoming',
                name: 'events.upcoming',
                component: ListEvents
              },
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
            component: { template: '<router-view></router-view>' },
            children: [
              {
                path: '',
                name: 'events.show',
                component: ShowEvent,
                props: true
              },
              {
                path: 'contacts/:contactId/edit',
                name: 'events.contactedit',
                component: EditContact,
                props: true
              },
              {
                path: 'contacts/new',
                name: 'events.contactnew',
                component: NewContact,
                props: true
              }
            ]
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
        path: 'chapters',
        component: { template: '<router-view></router-view>' },
        children: [
          {
            path: '',
            name: 'chapters.list',
            component: ListChapters
          },
          {
            path: 'new',
            name: 'chapters.new',
            component: NewChapter
          },
          {
            path: ':id/edit',
            name: 'chapters.edit',
            component: EditChapter,
            props: true
          }
        ]
      },
      {
        path: 'categories',
        component: { template: '<router-view></router-view>' },
        children: [
          {
            path: '',
            name: 'facets.list',
            component: ShowFacets
          }
        ]
      },
      {
        path: 'search',
        name: 'search',
        component: Search
      },
      {
        path: 'usersettings',
        name: 'usersettings',
        component: UserSettings
      },
      {
        path: 'navigation',
        component: { template: '<router-view></router-view>' },
        children: [
          {
            path: '',
            name: 'navigation.show',
            component: ShowNavigation
          }
        ]
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
