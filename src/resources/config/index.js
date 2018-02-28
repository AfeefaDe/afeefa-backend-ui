import ResourceRegistry from 'data/resource/Registry'

import ActorRelations from '../ActorRelations'
import AnnotationCategories from '../AnnotationCategories'
import Annotations from '../Annotations'
import Categories from '../Categories'
import Chapters from '../Chapters'
import Contacts from '../Contacts'
import Events from '../Events'
import Facets from '../Facets'
import FacetItems from '../FacetItems'
import Locations from '../Locations'
import Orgas from '../Orgas'
import ResourceItems from '../ResourceItems'
import Search from '../Search'
import Todos from '../Todos'
import Users from '../Users'
import MetaData from '../MetaData'

ResourceRegistry.add('Events', Events)
ResourceRegistry.add('Orgas', Orgas)
ResourceRegistry.add('Contacts', Contacts)
ResourceRegistry.add('Locations', Locations)
ResourceRegistry.add('Categories', Categories)
ResourceRegistry.add('Facets', Facets)
ResourceRegistry.add('FacetItems', FacetItems)
ResourceRegistry.add('AnnotationCategories', AnnotationCategories)
ResourceRegistry.add('Annotations', Annotations)
ResourceRegistry.add('ResourceItems', ResourceItems)
ResourceRegistry.add('ActorRelations', ActorRelations)
ResourceRegistry.add('Chapters', Chapters)
ResourceRegistry.add('Search', Search)
ResourceRegistry.add('Todos', Todos)
ResourceRegistry.add('Users', Users)
ResourceRegistry.add('MetaData', MetaData)
