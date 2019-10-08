<script>
  import { createEventDispatcher, getContext } from 'svelte'
  import { INP_GROUP } from 'components/element/InputGroup'
  import Scrubber from 'components/block/Scrubber'

  export let value = 0
  export let name = null
  
  const dispatch = createEventDispatcher()
  const inputGroup = getContext(INP_GROUP)

  let lastValue = value

  function focused(e) {
    const { target } = e
    dispatch('focus', e)
    lastValue = value

    target.onmouseup = () => {
      this.select()
      this.onmouseup = null
    }

    // if input is within an <InputGroup/>
    if (inputGroup) {
      inputGroup.setActive(true)
      inputGroup.setSelected(name)
    }
  }

  function blurred(e) {
    const { target } = e
    const validValue = validateValue(target.value)
    dispatch('blur', e)

    if (validValue != null) value = validValue
    else value = lastValue
    target.value = value

    // if input is within an <InputGroup/>
    if (inputGroup) {
      inputGroup.setActive(false)
      inputGroup.setSelected(null)
    }
  }

  function validateValue(value) {
    // current regex: if it's a ± number
    const regex = /^-?\d*(.\d+)?$/
    if (!regex.test(value)) return null
    else return Number(value)
  }

  function commands(e) {
    const { target, key, shiftKey } = e

    switch(key) {
      case 'ArrowUp':
        value += (shiftKey) ? 10 : 1
        target.select()
        break
      case 'ArrowDown':
        value -= (shiftKey) ? 10 : 1
        target.select()
        break
      case 'Enter':
        e.preventDefault()
        target.blur()
        break
      case 'Escape':
        value = target.value = lastValue
        target.blur()
      default: break
    }
  }
</script>

<style>
  #input { position: relative; }

  .scrubber-l, .scrubber-r {
    width: 3px;
    position: absolute;
    top: 0; bottom: 0;
    z-index: 1;
  }
  
  .scrubber-l { left: -1.5px; }
  .scrubber-r {
    /* scale very small to underlap
    scrubber on neighbouring inputs */
    transform: scaleX(0.99);
    right: -1.5px;
  }
</style>

<div id='input'>
  <Scrubber bind:value>
    <span class='scrubber-l'/>
  </Scrubber>
  
  <Scrubber bind:value>
    <span class='scrubber-r'/>
  </Scrubber>

  <input class='input' type='text'
    {name} {value}
    on:focus={focused}
    on:blur={blurred}
    on:keydown={commands}
  />
</div>