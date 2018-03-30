<template>
  <div>
    <div class="input-field">
      <h2>{{ $t("headlines.support_wanted") }}</h2>
      <input type="checkbox" id="support_wanted" class="filled-in" v-model="item.support_wanted"/>
      <label for="support_wanted">{{$t("entries.support_wanted_yes")}}</label>
    </div>

    <div class="input-field" v-if="item.support_wanted">
      <label for="supportWantedDetail" :class="{active: item.support_wanted_detail}">
        {{$t("entries.support_wanted_detail")}}
        <span class="labelCharacterCount" v-if="item.support_wanted_detail">{{item.support_wanted_detail.length}}/350</span>
      </label>

      <textarea
        id="supportWantedDetail"
        name="support_wanted_detail"
        v-model="item.support_wanted_detail"
        :data-vv-as="$t('entries.support_wanted_detail')"
        v-validate.initial="'max: 350'"
        v-bind:class="[
          {'validation-error': errors.has('support_wanted_detail')},
          'materialize-textarea']"
        v-autosize>
      </textarea>
      <span v-show="errors.has('support_wanted_detail')" class="validation-error">{{ errors.first('support_wanted_detail') }}</span>
    </div>

    <!-- this v-if condition is a hotfix for #339 and should be implemented in the api as well -->
    <div class="input-field">
      <h2>{{ $t("headlines.certified_sfr") }}</h2>
      <input type="checkbox" id="certified_sfr" class="filled-in" v-model="item.certified_sfr"/>
      <label for="certified_sfr">{{$t("entries.certified_sfr_yes")}}</label>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],

  inject: ['$validator']
}
</script>
