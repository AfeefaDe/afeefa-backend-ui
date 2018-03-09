import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'

class FacetItem extends Model {
  static type = 'facet_items'

  static attributes () {
    return {
      title: DataTypes.String,
      color: DataTypes.String,
      facet_id: DataTypes.String
    }
  }

  serialize () {
    return {
      title: this.title,
      color: this.color
    }
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Registry.add(FacetItem)
