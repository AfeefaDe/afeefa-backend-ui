import MetaDataResource from '@/resources/MetaData'
import LoadingState from 'uidata/api/LoadingState'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'

class MetaData extends Model {
  static type = 'meta'

  static Resource = new MetaDataResource(MetaData)

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

export default Model.register(MetaData)
