<script>
  import { postMessage } from 'ui'

  const padding = {
    pt: 8, pb: 8,
    pl: 8, pr: 8
  }

  $: padding, (postMessage({
      type: 'update',
      payload: padding
    })
  )

  function submit(e) {
    e.preventDefault()
    postMessage({ 
      type: 'confirm',
      payload: padding
    })
  }

  function cancel() {
    postMessage({
      type: 'cancel'
    })
  }
</script>

<form on:submit={submit}>
  <div>
    <div>Top</div>
    <input bind:value={padding.pt} type='number'/>

    <div>Right</div>
    <input bind:value={padding.pr} type='number'/>

    <div>Bottom</div>
    <input bind:value={padding.pb} type='number'/>

    <div>Left</div>
    <input bind:value={padding.pl} type='number'/>
  </div>

  <button on:click={cancel} type='button'>Cancel</button>
  <button type='submit'>Confirm</button>
</form>