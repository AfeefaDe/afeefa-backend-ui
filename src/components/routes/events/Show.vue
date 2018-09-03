<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="event" :routeConfig="routeConfig" slot="headerButtons" v-if="event" />

    <div v-if="event">
      <image-container :image-url="event.media_url" />

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="overview">
          <div class="splitView">
            <div class="entryDetail splitView__splitViewChild">

              <entry-detail-property
                :name="$tc('entries.date')"
                :iconName="'date_range'">
                  {{ event | formatEventDate }}
                  <span>({{event.date_start | formatDateRelative}})</span>
              </entry-detail-property>

              <entry-detail-property name="Veranstalter" iconName="group">
                <editable-event-hosts :owner="event" relationName="hosts" title="Veranstalter" :showActors="true">
                  <div slot="actor" slot-scope="props">
                    <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                      {{ props.actor.title }}
                    </router-link>
                  </div>
                </editable-event-hosts>
              </entry-detail-property>

              <entry-detail-property
                :name="$t('entries.description')"
                iconName="format_align_left"
                :isMultiline="true">
                <div v-if="event.short_description">{{event.short_description}}</div>
              </entry-detail-property>

              <div v-for="(facet, index) in facets" :key="facet.id">
                <entry-detail-property
                  :name="facet.title"
                  :iconName="index ? '' : 'bookmark_border'">
                  <editable-entry-facet-items :entry="item" :facets="[facet]" :bus="bus" />
                </entry-detail-property>
              </div>
            </div>

            <contact-list :item="event" class="splitView__splitViewChild"/>

            <entry-detail-footer :entry="event"/>

          </div>
        </section>

        <section slot="todos">
          <annotation-view :entry="event" />
        </section>

      </tab-bar>
    </div>

  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import EventRouteConfig from './EventRouteConfig'

import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ContactList from '@/components/contact/ContactList'
import EditableEventHosts from '@/components/actor/EditableEventHosts'
import ImageContainer from '@/components/ImageContainer'
import EditableEntryFacetItems from '@/components/entry/facets/EditableEntryFacetItems'
import AnnotationView from '@/components/annotation/AnnotationView'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this, this.id),
      bus: this
    }
  },

  computed: {
    event () {
      return this.item
    },

    tabNames () {
      let tabNames = ['overview']
      tabNames.push({name: 'todos', hint: this.event.annotations.length})
      return tabNames
    }
  },

  components: {
    EntryDetailHeaderButtons,
    EntryDetailFooter,
    ContactList,
    EditableEventHosts,
    ImageContainer,
    EditableEntryFacetItems,
    AnnotationView
  }
}
</script>


<style lang="scss" scoped>
.splitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: 100%;
  }
  & > &__splitViewChild {
    width: 50%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }
}
</style>
