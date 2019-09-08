<style type='text/scss'>
  h1 {
    color: blue;

    & > * {
      color: yellow;
    }
  }
</style>

<script>
  let a = 3
</script>

<input bind:value={a} type='number' />
<h1>REndered! {a}<span>yo this is green</span></h1>