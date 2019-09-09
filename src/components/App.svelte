<script>
  const padding = {
    pt: 0, pb: 0,
    pl: 0, pr: 0
  }

  function submit(e) {
    e.preventDefault()
    parent.postMessage({ 
      pluginMessage: {
        type: 'create',
        payload: padding
      }
    }, '*')
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

  <button type='submit'>Create</button>
</form>