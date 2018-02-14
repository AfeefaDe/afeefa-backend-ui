<template>
<div class="row">
  <div class="col s12 m12">
    <div class="mainCard" v-if="item">

      <div v-bind:class="['mainCard__header', 'mainCard__headerCategories']">
        <a href="" @click.prevent="goBack"><i class="material-icons go-back">chevron_left</i></a>
        <div class="mainCard__headerTitle">
          <span class="mainCard__type">Kapitel {{item.order}}</span>
          <h2 class="mainCard__headerTitleHeading">{{ item.title || 'Kein Titel' }}</h2>
        </div>
        <div class="mainCard__headerButtonContainer">
          <router-link :to="{name: item.type + '.edit', params: {id: item.id}}" class="mainCard__headerButton">
            {{$t('buttons.edit')}}
            <i class="material-icons">mode_edit</i>
          </router-link>
        </div>
      </div>

      <div>
        <ul class="entryDetail">
          <entry-detail-property
            v-if="item.title"
            :name="$t('entries.title')">
            <entry-icon :item="item" slot="icon" />
            {{ item.title }}
          </entry-detail-property>

          <entry-detail-property v-if="item.content"  :name="$t('entries.description')" :iconName="'info_outline'" :isMultiline="true">{{ item.content }}</entry-detail-property>
        </ul>
      </div>

    </div>

    <div v-else class="mainCard">
      <div class="mainCard__header mainCard__headerLight">
        <span v-if="loadingError">Das Kapitel konnte nicht geladen werden.</span>
        <span v-else>Lade Kapitel ...</span>
      </div>
    </div>

  </div>
</div>
</template>


<script>
import Chapter from '@/models/Chapter'
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import EntryDetailProperty from '@/components/entry/show/EntryDetailProperty'
import EntryIcon from '@/components/entry/EntryIcon'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      Resource: Chapter
    }
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },

  components: {
    EntryDetailProperty,
    EntryIcon
  }
}
</script>

<style lang="scss" scoped>
</style>
