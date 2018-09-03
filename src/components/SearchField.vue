<template>
  <div class="searchBar">
    <div class="searchFormContainer">
      <div class="searchForm">
        <form autocomplete="off" @submit.prevent="search" class="searchForm">
          <div class="searchForm__input">
            <label for="searchterm" class="browser-default">{{$t('headlines.searchPlaceholder')}}</label>
            <input autofocus class="browser-default validate'" type="text" id="searchterm" ref="search" v-model="keyword" @input="livesearch">
          </div>
          <a v-if="keyword" @click.prevent="clearSearch" href="#"><i class="material-icons searchForm__icon">cancel</i></a>
        </form>
      </div>
      <div class="searchButtons">
        <button class="btn waves-effect waves-light hideDesktop" type="submit">{{$t('buttons.search')}}</button>
      </div>
    </div>

    <div class="searchFilter">
      <label for="field" class="browser-default">
        {{ $t('infos.search_field')}}
      </label>

      <select id="field" v-model="filterCriterion"
        :class="['browser-default', {'validation-error': errors.has('category') }]">
        <option :value="option" v-for="option in filterOptions" :key="option.value">
          {{ option.name }}
        </option>
      </select>
    </div>
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
.searchForm {
  flex-grow: 1;
  position: relative;
  &__input {
    input {
      margin-bottom: 1em;
    }
  }
  &__icon {
    font-size: 18px;
    position: absolute;
    bottom: 8px;
    right: 8px;
    color: #666666;
  }
}
.searchBar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.searchFormContainer {
  flex-grow: 2;
  max-width: 40em;
  display: flex;
  flex-wrap: nowrap;
  margin-right: 1em;
}
.searchButtons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  button {
    margin-left: 10px;
  }
}
.searchFilter {
  width: 16em;

  select {
    width: auto;
  }
}

</style>
