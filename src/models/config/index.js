import ModelRegistry from './Registry'

import Event from '../Event'
import Orga from '../Orga'
import Contact from '../Contact'
import ContactPerson from '../ContactPerson'
import Location from '../Location'
import Category from '../Category'

import AnnotationCategory from '../AnnotationCategory'
import Annotation from '../Annotation'
import ResourceItem from '../ResourceItem'
import ActorRelations from '../ActorRelations'
import Chapter from '../Chapter'

import User from '../User'

ModelRegistry.add('Event', Event)
ModelRegistry.add('Orga', Orga)
ModelRegistry.add('Contact', Contact)
ModelRegistry.add('ContactPerson', ContactPerson)
ModelRegistry.add('Location', Location)
ModelRegistry.add('Category', Category)

ModelRegistry.add('AnnotationCategory', AnnotationCategory)
ModelRegistry.add('Annotation', Annotation)
ModelRegistry.add('ResourceItem', ResourceItem)
ModelRegistry.add('ActorRelations', ActorRelations)
ModelRegistry.add('Chapter', Chapter)

ModelRegistry.add('User', User)

ModelRegistry.initializeAll()
