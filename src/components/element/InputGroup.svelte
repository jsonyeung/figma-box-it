<script context='module'>
  export const INP_GROUP = {}
</script>

<script>
  import { setContext } from 'svelte'
  import Input from 'components/block/Input'

  let active = false
  let selected = null

  setContext(INP_GROUP, {
    setActive: (val) => active = val,
    setSelected: (name) => selected = name
  })
</script>

<div class='input-group' class:active>
  <label class='input-group__icon'>
    <slot name='icon'></slot>
  </label>

  <slot {active} {selected}></slot>
</div>