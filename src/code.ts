figma.showUI(__html__)

// Capture Dimensions of Current Selection
let selection = figma.currentPage.selection
const frame = selection[0].parent
let box = null
let initialBox = null

const clone = []
for (const node of selection) {
  if (box == null && node.name.endsWith(':boxed')) { 
    box = node
    initialBox = {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    }
    continue 
  }
  const nclone = node.clone()
  nclone.x = node.absoluteTransform[0][2]
  nclone.y = node.absoluteTransform[1][2]
  clone.push(nclone)
}

const group = figma.group(clone, frame)
const { x, y, width, height } = group
group.remove()

// Create Box
if (box == null) createBox({ pt: 0, pr: 0, pb: 0, pl: 0 })

function createBox(padding) {
  box = figma.createRectangle()
  box.name = `${box.name}:boxed`
  box.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
  updateBox(padding)

  frame.insertChild(0, box)
}

function updateBox(padding) {
  // If user deletes the box, rerender a new box
  if (box.removed) createBox(padding)
  
  const { pt, pr, pb, pl } = padding
  box.resize((width + pl + pr), (height + pt + pb))
  box.x = (x - pl); box.y = (y - pt)
  figma.currentPage.selection = [box]
}

function undoChanges() {
  if (box && !box.removed) {
    if (initialBox) {
      const { width, height, x, y } = initialBox
      box.resize(width, height)
      box.x = x; box.y = y
    } else { box.remove() }
  }
}

// Event Handler for UI
figma.ui.onmessage = (msg) => {
  const { type, payload } = msg

  if (type === 'update') {
    updateBox(payload)

  } else if (type === 'confirm') {
    figma.closePlugin()

  } else if (type === 'cancel') {
    undoChanges()
    figma.closePlugin()
  }
}