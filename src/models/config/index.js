import ModelRegistry from 'data/model/Registry'

import ActorRelations from '../ActorRelations'
import Annotation from '../Annotation'
import AnnotationCategory from '../AnnotationCategory'
import Category from '../Category'
import Chapter from '../Chapter'
import Contact from '../Contact'
import ContactPerson from '../ContactPerson'
import Event from '../Event'
import Location from '../Location'
import Orga from '../Orga'
import ResourceItem from '../ResourceItem'
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
