<template>
  <div class="input-field">
    <select multiple>
      <option value="" disabled selected>Choose your option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <label>Materialize Multiple Select</label>
  </div>
</template>

<script>
import $ from 'jQuery'

export default {
  created () {
    $('select').material_select()
  }
}
</script>

<style lang="scss">

</style>
