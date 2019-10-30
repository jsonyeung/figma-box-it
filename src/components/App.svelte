<script>
  import { postMessage } from 'ui'
  import Input from 'components/block/Input'
  import Scrubber from 'components/block/Scrubber'
  import InputGroup from 'components/element/InputGroup'

  import PaddingIcon from 'public/icons/padding.svg'
  import DoublePaddingIcon from 'public/icons/padding-double.svg'
  import LockIcon from 'public/icons/lock.svg'
  import UnlockIcon from 'public/icons/lock-unlocked.svg'

  let lock = { x: false, y: false }
  let padding = {
    pt: 0, pr: 0,
    pb: 0, pl: 0
  }

  // equalize x/y-axis padding when constrained
  $: {
    const { pt, pl, pb, pr } = padding
    if (lock.x) padding.pt = padding.pb = Math.max(pt, pb)
    if (lock.y) padding.pl = padding.pr = Math.max(pl, pr)
  }
  
  padding = new Proxy(padding, {
    set: function(obj, key, val) {
      if (lock.x || lock.y) {
        switch(key) {
          case 'pt': if (lock.x) obj.pb = val; break
          case 'pb': if (lock.x) obj.pt = val; break
          case 'pl': if (lock.y) obj.pr = val; break
          case 'pr': if (lock.y) obj.pl = val; break
          default: break
        }
      }

      obj[key] = val
      return true
    }
  })

  // update padding on value change
  $: padding, (
    postMessage({
      type: 'update',
      payload: {...padding}
    })
  )

  function submit(e) {
    e.preventDefault()
    postMessage({
      type: 'confirm'
    })
  }

  function cancel() {
    postMessage({
      type: 'cancel'
    })
  }
</script>

<style>
  form { margin: -4px 0 0; }

  .inputs, .buttons {
    padding: 4px 4px 0;
    display: flex;
    flex-wrap: nowrap;
    user-select: none;
  }

  .buttons {
    margin: 4px -4px 0;
    justify-content: flex-end;
  }
  .buttons > * { margin: 0 4px; }

  .icon-pb { transform: rotate(180deg); }
  .icon-pr { transform: rotate(90deg) !important; }
</style>

<form on:submit={submit}>
  <div class='inputs'>
    <InputGroup let:selected>
      <span slot='icon'
        class={`icon icon-${selected}`}>
        {#if lock.x} {@html DoublePaddingIcon}
        {:else} {@html PaddingIcon}
        {/if}
      </span>

      <Input name='pt' bind:value={padding.pt}/>
      <Input name='pb' bind:value={padding.pb}/>
    </InputGroup>

    <button type='button'
      on:click={() => lock.x = !lock.x}
      class:active={lock.x}
      class='button button--icon'
      style='margin-left: 8px'>
      {#if lock.x} {@html LockIcon}
      {:else} {@html UnlockIcon}
      {/if}
    </button>
  </div>

  <div class='inputs'>
    <InputGroup let:selected>
      <span slot='icon'
        class={`icon-${selected}`}
        style='transform: rotate(-90deg)'>
        {#if lock.y} {@html DoublePaddingIcon}
        {:else} {@html PaddingIcon}
        {/if}
      </span>
      
      <Input name='pl' bind:value={padding.pl}/>
      <Input name='pr' bind:value={padding.pr}/>
    </InputGroup>

    <button type='button'
      on:click={() => lock.y = !lock.y}
      class:active={lock.y}
      class='button button--icon'
      style='margin-left: 8px'>
      {#if lock.y} {@html LockIcon}
      {:else} {@html UnlockIcon}
      {/if}
    </button>
  </div>

  <div class='buttons'>
    <button type='button'
      on:click={cancel}
      class='button button--secondary'
      style='border: none'>
      Cancel
    </button>

    <button type='submit'
      class='button button--primary'>
      Confirm  
    </button>
  </div>
</form>
