<template>
  <entry-detail :component="this">

    <entry-detail-header-buttons :entry="orga" :routeConfig="routeConfig" slot="headerButtons" v-if="orga" />

    <div v-if="orga">
      <image-container
        :image-url="orga.media_url">
      </image-container>

      <tab-bar @setCurrentTab="setCurrentTab" :tabNames="tabNames">
        <section slot="generalTab" class="generalTab generalTab--splitView">

          <div class="entryDetail generalTab__splitViewChild">

            <entry-detail-property
              name="Angebote"
              iconName="bookmark_border">
              <div v-for="offer in orga.offers" :key="offer.id">
                <router-link :to="{name: 'offers.show', params: {id: offer.id}}">
                  {{ offer.title }}
                </router-link>
              </div>
            </entry-detail-property>

            <entry-detail-property
              name="Kategorien"
              iconName="bookmark_border">
              <entry-facet-items :entry="orga" :isEdit="true" />
            </entry-detail-property>

            <entry-detail-property name="Projektträger" :iconName="'device_hub'">
              <actor-actors :owner="orga" relationName="project_initiators" title="Projektträger">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </actor-actors>
            </entry-detail-property>

            <entry-detail-property name="Netzwerke">
              <actor-actors :owner="orga" relationName="networks" title="Netzwerke">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </actor-actors>
            </entry-detail-property>

            <entry-detail-property name="Partner">
              <actor-actors :owner="orga" relationName="partners" title="Partner">
                <div slot="actor" slot-scope="props">
                  <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
                    {{ props.actor.title }}
                  </router-link>
                </div>
              </actor-actors>
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.description')"
              :iconName="'more_horiz'"
              :isMultiline="true">
              <div v-if="orga.short_description">{{orga.short_description}}</div>
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.support_wanted')"
              :iconName="'pan_tool'"
              v-if="orga.support_wanted">
                <template v-if="orga.support_wanted_detail">
                  {{orga.support_wanted_detail}}
                </template>
                <template v-else>
                  {{$t('entries.support_wanted_yes')}}
                </template>
            </entry-detail-property>

            <entry-detail-property
              :name="$t('entries.certified_sfr')"
              :iconName="'check_circle'"
              v-if="orga.certified_sfr">
                {{$t('entries.certified_sfr_yes')}}
            </entry-detail-property>

            <entry-detail-property
              v-if="orga.tags"
              :name="$tc('entries.tags', orga.tags.split(',').length)"
              :iconName="'more_vert'">
                <ul>
                  <li v-for="tag in orga.tags.split(',')" :key="tag" class="singleTag">
                    {{tag}}
                  </li>
                </ul>
            </entry-detail-property>

            <entry-detail-property
              name="Facebook ID für Events"
              iconName="share"
             >
              {{ orga.facebook_id || 'Keine ID angegeben'}}
            </entry-detail-property>

            <entry-detail-property
              :name="$tc('headlines.annotations', orga.annotations.length)"
              :iconName="'label_outline'"
              v-if="orga.annotations.length">
              <div>
                <annotation-tag v-for="annotation in orga.annotations" :annotation="annotation" :key="annotation.id"></annotation-tag>
              </div>
            </entry-detail-property>

          </div>

          <contact-list :item="orga" class="generalTab__splitViewChild"/>

          <entry-detail-footer :entry="orga"/>
        </section>

        <section slot="resourceTab" v-if="orga.resource_items.length">
          <resource-item v-for="resourceItem in orga.resource_items" :key="resourceItem.id" :resourceItem="resourceItem"
          :editEnabled="false"></resource-item>
        </section>

        <section slot="networkMembersTab">
          <actor-selector title="Netzwerkmitglieder ändern" :actor="orga" relationName="network_members" @saved="actorRelationSaved" />

          <entry-list-items
            :items="orga.network_members"
            v-if="orga.network_members.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Mitglieder zugeordnet
          </div>

          <actor-selector title="Netzwerkmitglieder ändern" :actor="orga" relationName="network_members" @saved="actorRelationSaved" />
        </section>

        <section slot="projectsTab">
          <actor-selector title="Projekte ändern" :actor="orga" relationName="projects" @saved="actorRelationSaved" />

          <entry-list-items
            :items="orga.projects"
            v-if="orga.projects.length">
          </entry-list-items>
          <div v-else class="entryDetail__error">
            Keine Projekte zugeordnet
          </div>

          <actor-selector title="Projekte ändern" :actor="orga" relationName="projects" @saved="actorRelationSaved" />
        </section>

        <section slot="eventsTab">
          <h5>{{ $t('headlines.upcomingEvents') }}</h5>

          <entry-list-items
            :items="orga.upcoming_events"
            v-if="orga.upcoming_events.length"
            :sort-function="sortByDateMixin"
            sort-order="ASC"
            :options="{event_date: true}">
          </entry-list-items>

          <h5>{{ $t('headlines.pastEvents') }}</h5>

          <entry-list-items
            :items="orga.past_events"
            v-if="orga.past_events.length"
            :sort-function="sortByDateStart"
            sort-order="DESC"
            :options="{event_date: true}">
          </entry-list-items>
        </section>
      </tab-bar>
    </div>

  </entry-detail>

</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import OrgaRouteConfig from './OrgaRouteConfig'

import EntryDetailHeaderButtons from '@/components/entry/show/EntryDetailHeaderButtons'
import ImageContainer from '@/components/ImageContainer'
import EntryFacetItems from '@/components/entry/EntryFacetItems'
import ActorActors from '@/components/entry/show/relations/ActorActors'
import ContactList from '@/components/contact/ContactList'
import EntryDetailFooter from '@/components/entry/show/EntryDetailFooter'
import ActorSelector from '@/components/selector/ActorSelector'
import EntryListItems from '@/components/entry/EntryListItems'
import AnnotationTag from '@/components/AnnotationTag'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  },

  computed: {
    orga () {
      return this.item
    },

    tabNames () {
      let tabNames = ['generalTab']
      if (this.currentUser.area === 'dresden') {
        tabNames.push({name: 'resourceTab', hint: this.orga.resource_items.length})
      }
      tabNames.push({name: 'networkMembersTab', hint: this.orga.network_members.length})
      tabNames.push({name: 'projectsTab', hint: this.orga.projects.length})
      tabNames.push({name: 'eventsTab', hint: this.orga.upcoming_events.length + this.orga.past_events.length})
      return tabNames
    }
  },

  methods: {
    actorRelationSaved () {
      this.orga.$rels.actor_relations.refetch()
    }
  },

  components: {
    EntryDetailHeaderButtons,
    ImageContainer,
    EntryFacetItems,
    ActorActors,
    ContactList,
    EntryDetailFooter,
    ActorSelector,
    EntryListItems,
    AnnotationTag
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
    padding: 1em;
    @media screen and (max-width: $break-medium) {
      width: 100%;
    }
  }
}
</style>
