<template>
  <div class="searchBar">

    <div class="searchFormContainer">
      <div class="searchForm">
        <form autocomplete="off" @submit.prevent="search" class="searchForm">
          <div class="input-field searchForm__input">
            <input autofocus :class="[{active: keyword}, 'validate']" type="text" id="searchterm" ref="search" v-model="keyword" @input="livesearch">
            <label for="searchterm">{{$t('headlines.searchPlaceholder')}}</label>
          </div>
        </form>
      </div>

      <div class="searchButtons">
        <a v-if="keyword" @click.prevent="clearSearch" href="#"><i class="material-icons searchForm__icon">cancel</i></a>
        <button class="btn waves-effect waves-light hideDesktop" type="submit">{{$t('buttons.search')}}</button>
      </div>
    </div>

    <div class="searchFilter">
      <label class="typo__label">{{ $t('infos.search_field')}}</label>
      <multiselect v-model="filterCriterion" @input="filterChanged" :options="filterOptions" :allow-empty="false" :searchable="false" :close-on-select="true" :show-labels="false" label="name"></multiselect>
    </div>

    <!-- <div class="switch-toggle switch-ios toggleButton">
      <input id="orgas" name="view" type="radio" value="orgas" v-model="typeFilterState">
      <label for="orgas" onclick="">Orgas</label>

      <input id="both-type" name="view" type="radio" value="none" v-model="typeFilterState">
      <label for="both-type" onclick="">Beides</label>

      <input id="events" name="view" type="radio" value="events" v-model="typeFilterState">
      <label for="events" onclick="">Events</label>

      <a></a>
    </div> -->

  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  props: ['filterOptions', 'filterDefault'],
  data () {
    return {
      keyword: '',
      filterCriterion: null
    }
  },

  created () {
    this.filterCriterion = this.filterOptions.find(x => x.value === this.filterDefault)
  },

  watch: {
    'keyword': function (keyword) {
      if (keyword.length === 0) {
        this.clearSearch()
      }
    }
  },

  methods: {
    livesearch () {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }
      this.debounceTimeout = setTimeout(() => {
        this.updateSearchItems()
      }, 400)
    },
    filterChanged () {
      this.updateSearchItems()
    },
    search () {
      this.updateSearchItems()
    },
    keyWordIsValid () {
      return this.keyword.length >= 2 && this.keyword.trim().length > 0
    },
    clearSearch () {
      this.keyword = ''
      this.filterCriterion = this.filterOptions.find(x => x.value === this.filterDefault)
      this.$emit('input', null)
    },
    updateSearchItems () {
      if (this.keyWordIsValid()) {
        this.$emit('input', {keyword: this.keyword, filterCriterion: this.filterCriterion.value})
      }
    }
  },

  components: {
    Multiselect
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.searchForm {
  flex-grow: 1;
  &__input {
    input {
      margin-bottom: 1em;
    }
  }
  &__icon {
    color: $black;
    margin-right: 20px;
  }
}

.searchFormContainer {
  flex-grow: 1;
  max-width: 30em;
  display: flex;
  flex-wrap: nowrap;
  margin-right: 20px;
}

.searchButtons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  button {
    margin-left: 10px;
  }
}

.searchBar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.searchFilter {
  width: 16em;
  margin-bottom: 10px;
  margin-right: 20px;
}

.toggleButton {
  margin-top: 10px;
  align-self: center;
}

/* hide radio button circles from materialize */
[type="radio"]:not(:checked)+label, [type="radio"]:checked+label {
  padding-left: 5px;
  border: none;
  outline:none;
}
label::before {
  display: none;
}
label::after {
  display: none;
}
</style>
