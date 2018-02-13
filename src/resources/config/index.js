import ResourceRegistry from './Registry'

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

ResourceRegistry.add('Events', Events)
ResourceRegistry.add('Orgas', Orgas)
ResourceRegistry.add('Contacts', Contacts)
ResourceRegistry.add('Locations', Locations)
ResourceRegistry.add('Categories', Categories)

ResourceRegistry.add('AnnotationCategories', AnnotationCategories)
ResourceRegistry.add('Annotations', Annotations)
ResourceRegistry.add('ResourceItems', ResourceItems)
ResourceRegistry.add('ActorRelations', ActorRelations)
ResourceRegistry.add('Chapters', Chapters)

ResourceRegistry.add('Search', Search)
ResourceRegistry.add('Todos', Todos)
ResourceRegistry.add('Users', Users)
