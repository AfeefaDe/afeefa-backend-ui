export default class OrgaType {
  static ORGANIZATION = 2
  static PROJECT = 3
  static LOCATION = 4
  static NETWORK = 5

  static TYPES = [
    {
      id: OrgaType.ORGANIZATION,
      name: 'Organization'
    },
    {
      id: OrgaType.PROJECT,
      name: 'Project'
    },
    {
      id: OrgaType.LOCATION,
      name: 'Location'
    },
    {
      id: OrgaType.LOCATION,
      name: 'Network'
    }
  ]

  static getById (id) {
    return OrgaType.TYPES.find(type => type.id === id)
  }
}
