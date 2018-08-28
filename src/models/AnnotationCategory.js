import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'

class AnnotationCategory extends Model {
  static type = 'annotation_categories'

  static ResourceUrl = 'annotation_categories{/id}'
  static attributes () {
    return {
      title: DataTypes.String,

      generatedBySystem: {
        type: DataTypes.Boolean,
        remoteName: 'generated_by_system'
      },

      count_entries: DataTypes.Int
    }
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Registry.add(AnnotationCategory)
