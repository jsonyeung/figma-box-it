const UI_CONF = { width: 168, height: 132 }
figma.showUI(__html__, UI_CONF)

const selection: SceneNode[] = [...figma.currentPage.selection]
const target = selection[0].parent

function isValidSelection(): boolean {
  if (selection.length <= 0) {
    figma.notify('📦 Box It: Please select at least 1 layer to box.')
    return false
  }

  for (const node of selection) {
    if (node.parent !== target) {
      figma.notify('📦 Box It: Your selection must be within the same Frame or Group.')
      return false
    }
  }

  let parent = target
  while (parent.type !== 'PAGE') {
    if (parent.type === 'INSTANCE') {
      figma.notify('📦 Box It: Your selection cannot be within an Instance.')
      return false
    }
    parent = parent.parent
  }
  
  return true
}

function makeSelection(val: SceneNode[]): void {
  figma.currentPage.selection = val
}

// Run code only if selection is valid
if (!isValidSelection()) figma.closePlugin()
else {

  // Save dimensions of selected layers
  const prevDim: Record<string, Dim> = {}
  for (const node of selection) {
    prevDim[node.id] = getDim(node)
  }

  function getDim(el: SceneNode): Dim {
    return {
      w: el.width,
      h: el.height,
      x: el.x,
      y: el.y
    }
  }

  // Get Bounding Box selection
  let bbox: Dim = getBoundingBox()

  function getBoundingBox(): Dim {
    const clone = []
    for (const node of selection) {
      if (node.removed) continue
      const cnode = node.clone()
      cnode.x = node.absoluteTransform[0][2]
      cnode.y = node.absoluteTransform[1][2]
      clone.push(cnode)
    }
    
    const group = figma.group(clone, target)
    const bbox = getDim(group)
    group.remove()
    return bbox
  }

  function updateBoundingBox(): void {
    if (selection.length <= 0) return
    let updated = false;

    for (const [i, node] of selection.entries()) {
      const dim = prevDim[node.id]

      if (node.removed) {
        selection.splice(i, 1)
        updated = true
        
      } else if (
        (node.x !== dim.x) || (node.y !== dim.y) ||
        (node.width !== dim.w) || (node.height !== dim.h)) {
        prevDim[node.id] = getDim(node)
        updated = true
      }
    }
    
    if (updated) bbox = getBoundingBox()
  }

  // Set existing/new box
  let isNewBox: boolean = false
  const box: SceneNode = getBoxEl()

  prevDim.box = getDim(box)
  bbox = getBoundingBox()
  target.insertChild(0, box)
  makeSelection(selection.concat(box))

  function getBoxEl(): SceneNode {
    for (const [i, node] of selection.entries()) {
      if (selection.length <= 1) break
      if (node.name.endsWith(':boxed')) {
        selection.splice(i, 1)
        return node
      }
    }

    const newBox = figma.createRectangle()
    newBox.name += ':boxed'
    newBox.fills = [{ type: 'SOLID', color: { r: 0.75, g: 0.75, b: 0.75 } }]
    isNewBox = true
    return newBox
  }

  // Update Box
  function updateBox(padding: Padding): void {
    updateBoundingBox()

    const { pt, pb, pl, pr } = padding
    const { w, h, x, y } = bbox
    const dim = {
      w: Math.max((w + pl + pr), 2),
      h: Math.max((h + pt + pb), 2),
      x: (x - pl),
      y: (y - pt)
    }
    
    if (box.parent !== target) {
      target.insertChild(0, box)
    }
    
    box.resize(dim.w, dim.h)
    if (dim.w > 2) box.x = dim.x
    if (dim.h > 2) box.y = dim.y
  }

  // Revert any dimensional changes
  function reset(): void {
    const { w, h, x, y } = prevDim.box
    box.resize(w, h)
    box.x = x; box.y = y

    if (isNewBox) box.remove()
  }

  // exit plugin if user modifies the group/box
  setInterval(() => {
    if (box.removed) figma.closePlugin()
  }, 1000 / 60)

  // Event Handler for UI
  figma.ui.onmessage = (msg) => {
    const { type, payload } = msg

    switch(type) {
      case 'update':
        updateBox(payload)
        makeSelection([box])
        break
      case 'confirm':
        makeSelection(selection.concat(box))
        figma.closePlugin()
        break
      case 'cancel':
        reset()
        figma.closePlugin()

      default: break
    }
  }
}
