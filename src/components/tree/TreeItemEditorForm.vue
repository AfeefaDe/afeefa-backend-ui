<template>
  <div>
    <div class="editorForm" v-if="hasAttributes">
      <input class="browser-default" type="text" placeholder="Titel"
        v-focus v-select
        v-model="item.title"
        @keyup.enter="update()"
        @keyup.esc="cancel()">

      <color-picker
        v-if="hasColor"
        v-model="item.color"
        colors="material-basic"
        :trigger-style="{width: '22px', height: '22px', borderRadius: '0px'}"
        row-length="10"
        swatch-size="20"
      />

      <input
        v-if="hasColor"
        class="browser-default colorInput"
        type="text"
        placeholder="Farbe"
        v-model="item.color"
        @keyup.enter="update()"
        @keyup.esc="cancel()">

      <div v-if="hasIcon">
        <select class="browser-default" v-model="item.icon">
          <option :value="null">Icon auswählen</option>
          <option :value="icon" v-for="icon in icons" :key="icon">{{ icon }}</option>
        </select>
      </div>

      <button type="button" class="btn btn-small" @click="update()">
        <i class="material-icons left">done</i>
      </button>
    </div>

    <div class="editorForm" v-if="hasMove">
      <slot />
    </div>
  </div>
</template>

<script>
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  props: ['item', 'hasAttributes', 'hasColor', 'hasMove', 'hasIcon'],

  data () {
    return {
      icons: [
        'general',
        'language',
        'medic',
        'jobs',
        'consultation',
        'leisure',
        'community',
        'donation',
        'external-event',

        /* Sub categories */

        'wifi',
        'jewish',
        'christian',
        'islam',
        'religious-other',
        'shop',
        'nature',
        'authority',
        'hospital',
        'police',
        'public-transport',

        'german-course',
        'german-course-state',
        'meet-and-speak',
        'learning-place',
        'interpreter',
        'foreign-language',

        'medical-counselling',
        'psychological-counselling',

        'job-counselling',
        'education-counselling',
        'political-education',
        'library',

        'asylum-counselling',
        'legal-advice',
        'social-counselling',
        'family-counselling',
        'volunteer-coordination',

        'youth-club',
        'sports',
        'museum',
        'music',
        'stage',
        'craft-art',
        'workspace',
        'gardening',
        'cooking',
        'festival',
        'lecture',
        'film',
        'congress',

        'welcome-network',
        'meeting-place',
        'childcare',
        'workshop',
        'sponsorship',
        'lgbt',
        'housing-project',

        'food',
        'clothes',
        'furniture',

        'iwgr',
        'fb-event',

        /* LEIPZIG */

        'hotspots',
        'advice-and-support',
        'living-in-leipzig',
        'work-and-education'
      ]
    }
  },

  methods: {
    cancel () {
      this.$emit('cancel', this.item)
    },

    update () {
      this.$emit('update', this.item)
    }
  },

  components: {
    ColorPicker: Swatches
  }
}
</script>

<style lang="scss" scoped>
.editorForm {
  display: inline-flex;
  align-items: center;
  margin-top: .2em;
  background-color: #EEEEEE;
  padding: .3em;
}

.editorForm > * {
  line-height: 1em;
  margin-right: .4em !important;
}

.btn {
  margin-top: -1px;
  padding: 0 4px;
  i {
    font-size: 1rem;
  }
}

.colorInput {
  width: 80px;
}

select {
  padding: 2px 0;
  line-height: 1em;
}
</style>
