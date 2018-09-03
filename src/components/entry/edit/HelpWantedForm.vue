<template>
  <div>
    <div>
      <label class="browser-default">{{$t("entries.support_wanted")}}</label>
      <input type="checkbox" id="support_wanted" class="filled-in" v-model="item.support_wanted"/>
      <label for="support_wanted">{{$t("entries.support_wanted_yes")}}</label>
    </div>

    <text-input
      v-if="item.support_wanted"
      v-model="item.support_wanted_detail"
      fieldName="supportWantedDetail"
      :label="$t('entries.support_wanted_detail')"
      :placeholder="$t('entries.support_wanted_detail')"
      validate="max:350" />

    <!-- this v-if condition is a hotfix for #339 and should be implemented in the api as well -->
    <div class="formElement marginTop">
      <label class="browser-default">{{$t("entries.certified_sfr")}}</label>
      <input type="checkbox" id="certified_sfr" class="filled-in" v-model="item.certified_sfr"/>
      <label for="certified_sfr">
        {{item.certified_sfr ? $t('entries.certified_sfr_yes') : $t('entries.certified_sfr_no')}}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],

  inject: ['$validator']
}
</script>

<style lang="scss" scoped>
// input[type=checkbox] + label {
//   margin-top: .5em;
// }
</style>
