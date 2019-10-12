![Box-It Logo](https://raw.githubusercontent.com/jsonyeung/figma-box-it/develop/docs/logo.svg?sanitize=true)

# Figma Box It
A Figma plugin to create a bounding boxes with padding effortlessly.


## Usage
1. Select 1 or more layers
2. Run Box It (Menu > Plugins > 📦 Box It)

![Box-It Demo Gif](https://raw.githubusercontent.com/jsonyeung/figma-box-it/develop/docs/box-it-demo.gif)

Box It will automatically group selections of 2+ layers and bounds a box with padding.


**Using your own box layer**

Apply the `:boxed` suffix to the end of your layer name and Box It will automatically use the first :boxed element in your selection


## Installation & Development
```
npm install
```

**Running plugin**
```bash
# for development
npm run dev

# for production
npm run build
```


## Future Features/To Dos in Consideration
- [ ] Determine padding automatically when a `:boxed` element exists instead of default [12, 12] padding
- [ ] Ability to align box to a specific corner/edge

