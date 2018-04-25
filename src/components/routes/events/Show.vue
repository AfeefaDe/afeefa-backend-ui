<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="event" :routeConfig="routeConfig" slot="headerButtons" v-if="event" />

    <div v-if="event">
      <image-container
        :image-url="event.media_url">
      </image-container>

      <div class="generalTab generalTab--splitView">
        <div class="entryDetail generalTab__splitViewChild">

          <entry-detail-property
            name="Kategorien"
            iconName="bookmark_border">
            <entry-facet-items :entry="event" :isEdit="true" />
          </entry-detail-property>

          <entry-detail-property
            :name="$tc('entries.date')"
            :iconName="'date_range'">
              {{ event | formatEventDate }}
              <span>({{event.date_start | formatDateRelative}})</span>
          </entry-detail-property>

          <entry-detail-property name="Veranstalter" :iconName="'device_hub'">
            <event-hosts :owner="event" relationName="hosts" title="Veranstalter">
              <div slot="actor" slot-scope="props">
                <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                  {{ props.actor.title }}
                </router-link>
              </div>
            </event-hosts>
          </entry-detail-property>

          <entry-detail-property
            :name="$t('entries.description')"
            :iconName="'more_horiz'"
            :isMultiline="true">
            <div v-if="event.short_description">{{event.short_description}}</div>
          </entry-detail-property>

          <entry-detail-property
            :name="$tc('headlines.annotations', event.annotations.length)"
            :iconName="'label_outline'"
            v-if="event.annotations.length">
            <div>
              <annotation-tag v-for="annotation in event.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>
            </div>
          </entry-detail-property>

        </div>

        <contact-list :item="event" class="generalTab__splitViewChild"/>

        <entry-detail-footer :entry="event"/>

      </div>
    </div>

  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import EventRouteConfig from './EventRouteConfig'

import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ContactList from '@/components/contact/ContactList'
import EntryFacetItems from '@/components/entry/EntryFacetItems'
import EventHosts from '@/components/entry/show/relations/EventHosts'
import AnnotationTag from '@/components/AnnotationTag'
import ImageContainer from '@/components/ImageContainer'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this, this.id)
    }
  },

  computed: {
    event () {
      return this.item
    }
  },

  components: {
    EntryDetailHeaderButtons,
    EntryDetailFooter,
    ContactList,
    EntryFacetItems,
    EventHosts,
    AnnotationTag,
    ImageContainer
  }
}
</script>


<style lang="scss" scoped>
.generalTab--splitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: 100%;
  }
  > .generalTab__splitViewChild {
    width: 50%;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }
}
</style>
