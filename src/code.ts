figma.showUI(__html__)

function createBox(padding) {
  const selection = figma.currentPage.selection
  const frame = selection[0].parent

  const clone = []
  
  for (const node of selection) {
    const nclone = node.clone()
    nclone.x = node.absoluteTransform[0][2]
    nclone.y = node.absoluteTransform[1][2]
    clone.push(nclone)
  }

  const group = figma.group(clone, frame)
  
  // Create box
  const { pt, pr, pb, pl } = padding
  const { x, y, width, height } = group
  const box = figma.createRectangle()
  box.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }] // temp
  box.resize((width + pl + pr), (height + pt + pb))
  box.x = (x - pl); box.y = (y - pt)

  group.remove()
  
  // Insert selection & box as a group
  frame.insertChild(0, box)
  figma.currentPage.selection = [box, ...selection]
}

figma.ui.onmessage = (msg) => {
  const { type, payload } = msg

  if (type === 'create') createBox(payload)
  figma.closePlugin()
}