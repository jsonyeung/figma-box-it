<script>
  export let value = 0
  export let threshold = 2
  export let vertical = false
  export let reverse = false

  let lastPos = 0

  function mouseDown(e) {
    const { target } = e
    // get X or Y value based on scrub direction
    lastPos = (vertical) ? (-1 * e.clientY) : e.clientX
    
    // set listeners when holding to scrub
    document.body.style.cursor = (vertical) ? 'ns-resize' : 'ew-resize'
    document.addEventListener('mouseup', mouseUp, false)
    document.addEventListener('mousemove', mouseMove, false)
  }

  function mouseUp(e) {
    // remove listeners when done scrubbing
    document.body.style.cursor = 'initial'
    document.removeEventListener('mouseup', mouseUp, false)
    document.removeEventListener('mousemove', mouseMove, false)
  }

  function mouseMove(e) {
    const { shiftKey } = e
    const curPos = (vertical) ? (-1 * e.clientY) : e.clientX
    const dist = Math.abs(curPos - lastPos)

    if (dist >= threshold) {
      value += (
        Math.round(
          ((reverse) ? -1 : 1) *
          ((curPos > lastPos) ? 1 : -1) * 
          (dist / threshold)
        )
      )

      lastPos = curPos
    }
  }
</script>

<style>
  #scrubber { user-select: none; }
  .hor { cursor: ew-resize; }
  .vert { cursor: ns-resize; }
</style>

<div id='scrubber'
  class='{(vertical) ? 'vert' : 'hor'}'
  on:mousedown={mouseDown}>
  <slot></slot>
</div>