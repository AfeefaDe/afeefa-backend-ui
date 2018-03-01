import MetaDataResource from '@/resources/MetaData'
import LoadingState from 'data/api/LoadingState'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class MetaData extends Model {
  static type = 'meta'

  static query = MetaDataResource

  static attributes () {
    return {
      chapters: DataTypes.Int,
      events: DataTypes.Custom,
      orgas: DataTypes.Int,
      todos: DataTypes.Int
    }
  }

  calculateLoadingStateFromJson (json) {
    return LoadingState.FULLY_LOADED
  }

  normalizeJson (json) {
    let {chapters, events, orgas, todos} = json.meta
    return {
      id: json.id,
      attributes: {chapters, events, orgas, todos}
    }
  }
}
