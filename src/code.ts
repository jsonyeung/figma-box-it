const UI_CONF = { width: 168, height: 132 }
figma.showUI(__html__, UI_CONF)

const selection: SceneNode[] = [...figma.currentPage.selection]

function makeSelection(val: SceneNode[]): void {
  figma.currentPage.selection = val
}

// Set existing/new box
let isNewBox: boolean = false
const box: SceneNode = setBoxEl()
makeSelection(selection.concat(box))

function setBoxEl(): SceneNode {
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

// Get Group selection
const target = selection[0]
const group = (selection.length === 1) ?
  target : figma.group(selection, target.parent)

// Save group & box dimensions
const prevDim: Record<string, Dim> = {
  box: getDim(box)
}

function getDim(el: SceneNode): Dim {
  return {
    w: el.width,
    h: el.height,
    x: el.x,
    y: el.y
  }
}

// Update Rectangle
function updateBox(padding: Padding): void {
  const { pt, pb, pl, pr } = padding
  const { width, height, x, y } = group
  const dim = {
    w: Math.max((width  + pl + pr), 2),
    h: Math.max((height + pt + pb), 2),
    x: (x - pl),
    y: (y - pt)
  }

  if (box.parent !== group.parent) {
    group.parent.appendChild(box)
    group.parent.appendChild(group)
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
  if (group.removed || box.removed) figma.closePlugin()
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
