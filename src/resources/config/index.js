import registry from './Registry'

import Events from '../Events'
import Orgas from '../Orgas'
import Contacts from '../Contacts'
import Locations from '../Locations'
import Categories from '../Categories'

import AnnotationCategories from '../AnnotationCategories'
import Annotations from '../Annotations'
import ResourceItems from '../ResourceItems'
import ActorRelations from '../ActorRelations'
import Chapters from '../Chapters'

import Search from '../Search'
import Todos from '../Todos'
import Users from '../Users'

registry.add('Events', Events)
registry.add('Orgas', Orgas)
registry.add('Contacts', Contacts)
registry.add('Locations', Locations)
registry.add('Categories', Categories)

registry.add('AnnotationCategories', AnnotationCategories)
registry.add('Annotations', Annotations)
registry.add('ResourceItems', ResourceItems)
registry.add('ActorRelations', ActorRelations)
registry.add('Chapters', Chapters)

registry.add('Search', Search)
registry.add('Todos', Todos)
registry.add('Users', Users)
