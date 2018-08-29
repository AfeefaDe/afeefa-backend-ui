import EntriesResource from './base/Entries'

export default class OrgasResource extends EntriesResource {
  url = 'orgas{/id}{?ids}'

  lazyLoadList = true
}
