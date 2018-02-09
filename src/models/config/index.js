import registry from './Registry'

import Event from '../Event'
import Orga from '../Orga'
import Contact from '../Contact'
import Location from '../Location'
import Category from '../Category'

import AnnotationCategory from '../AnnotationCategory'
import Annotation from '../Annotation'
import ResourceItem from '../ResourceItem'
import ActorRelations from '../ActorRelations'
import Chapter from '../Chapter'

import User from '../User'

registry.add('Event', Event)
registry.add('Orga', Orga)
registry.add('Contact', Contact)
registry.add('Location', Location)
registry.add('Category', Category)

registry.add('AnnotationCategory', AnnotationCategory)
registry.add('Annotation', Annotation)
registry.add('ResourceItem', ResourceItem)
registry.add('ActorRelations', ActorRelations)
registry.add('Chapter', Chapter)

registry.add('User', User)
