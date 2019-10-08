# Figma Box It
A Figma plugin to create boxing with padding effortlessly.


## Usage
1. Select 1 or more layers
2. Run Box It (Menu > Plugins > 📦 Box It)



Box It will automatically group selections of 2+ layers and generate a box with padding.


**Using your own box layer**

Apply the `:boxed` suffix to the end of your layer name and Box it will automatically use the first :boxed element found in your selection


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

