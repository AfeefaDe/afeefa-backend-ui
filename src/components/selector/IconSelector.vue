<template>
  <div class="iconSelector">
    <a href="" ref="trigger" class="inlineEditLink iconContainer trigger" @click.prevent="openIconSelector">
      <div :class="['iconPreview', 'cat-' + selectedIcon]"></div>
    </a>

    <pop-up-selector :trigger="$refs.trigger" diffX="20" @close="hideIconSelector" v-if="iconSelectorIsOpen">
      <div class="icons">
        <span v-for="icon in icons" :key="icon" :class="['iconContainer', { selected: icon === selectedIcon }]" @click="select(icon)">
          <div :class="['iconPreview', 'cat-' + icon]"></div>
        </span>
      </div>
    </pop-up-selector>
  </div>
</template>

<script>
import PopUpSelector from '@/components/PopUpSelector'

export default {
  props: ['selectedIcon'],

  data () {
    return {
      iconSelectorIsOpen: false,
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
      ].sort()
    }
  },

  methods: {
    openIconSelector () {
      this.iconSelectorIsOpen = true
    },

    hideIconSelector () {
      this.iconSelectorIsOpen = false
    },

    select (icon) {
      this.$emit('select', icon)
      this.hideIconSelector()
    }
  },

  components: {
    PopUpSelector
  }
}
</script>

<style lang="scss" scoped>
.icons {
  display: inline-flex;
  max-width: 400px; // 10 * (34 + 6)
  flex-wrap: wrap;
}

.iconContainer {
  display: block;
  padding: 3px;
  width: 40px;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: $gray10;
  }

  &.selected {
    background-color: $gray20;
  }
}

.trigger {
  border: 1px solid $gray20;
  height: 2em;
  width: 2em;
  font-size: 1em;
  position: relative;
  .iconPreview {
    width: 1.8em;
    height: 1.8em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.iconPreview {
  display: block;
  width: 34px;
  height: 34px;
  line-height: 1;
  @include categorySymbols;
  filter: invert(100);
}
</style>


