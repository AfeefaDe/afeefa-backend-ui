import MetaDataResource from '@/resources/MetaData'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'

class MetaData extends Model {
  static type = 'meta'

  static Resource = MetaDataResource

  static attributes () {
    return {
      chapters: DataTypes.Int,
      events: DataTypes.Custom,
      orgas: DataTypes.Int,
      todos: DataTypes.Int
    }
  }

  beforeDeserialize (json) {
    return {
      id: json.id,
      ...json.meta
    }
  }
}

export default Registry.add(MetaData)
