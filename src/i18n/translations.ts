// Define the structure of our translations
interface TranslationsType {
  [key: string]: {
    [key: string]: string;
  };
}

// Define translations for both languages
const translations: TranslationsType = {
  en: {
    // App header
    "app.title": "MegaComparison",
    "app.description":
      "Compare camera sensors from 10MP to 100MP, with visual examples of resolution differences.",

    // Tab titles
    "tabs.size": "Size Comparison",
    "tabs.sensor": "Sensor Frame",
    "tabs.gallery": "Image Gallery",
    "tabs.focal": "Focal Length",

    // Controls
    "controls.title": "Select Resolutions to Compare",
    "controls.megapixels": "Megapixels",
    "controls.empty": "Please select at least one resolution option to compare",
    "controls.sensors": "Select Sensor Sizes to Compare",
    "controls.empty.sensors":
      "Please select at least one sensor size to compare",

    // Size Comparison
    "size.title": "Size Comparison",
    "size.stack": "Stack Blocks",
    "size.about.title": "About This Comparison",
    "size.about.description":
      "Visual comparison of relative sensor sizes at different megapixel resolutions.",

    // Sensor Comparison
    "sensor.title": "Sensor Size Comparison",
    "sensor.stack": "Stack Frames",
    "sensor.about.title": "About Sensor Sizes",
    "sensor.about.description":
      "Visual comparison of different camera sensor sizes. Larger sensors generally provide better image quality and low-light performance.",

    // Image Gallery
    "gallery.title": "Image Gallery",
    "gallery.about.title": "About This Gallery",
    "gallery.about.description":
      "Sample images showing simulated clarity differences between megapixel resolutions.",

    // Focal Length
    "focal.title": "Focal Length Visualizer",
    "focal.length": "Focal Length:",
    "focal.fov": "Field of View:",
    "focal.mm": "mm",
    "focal.degrees": "°",
    "focal.selected": "Selected Area",
    "focal.appears": "This shows how the scene would appear at",
    "focal.click": "Click anywhere on the image to move the red rectangle",
    "focal.about.title": "About Focal Length",
    "focal.about.description":
      "Simulated view of how focal length affects field of view and apparent distance in photography.",

    // Footer
    "footer.copyright":
      "© 2025 MegaComparison - A digital camera specs comparison tool",
    "footer.github": "View on GitHub",

    // Language
    "language.en": "English",
    "language.zh": "中文",
    "language.switch": "Switch to",
  },
  zh: {
    // App header
    "app.title": "像距直观比较",
    "app.description":
      "比较10MP至100MP相机传感器，提供分辨率差异的可视化示例。",

    // Tab titles
    "tabs.size": "尺寸比较",
    "tabs.gallery": "图像库",
    "tabs.focal": "焦距",
    "tabs.sensor": "传感器尺寸",

    // Controls
    "controls.title": "选择要比较的分辨率",
    "controls.megapixels": "",
    "controls.empty": "请至少选择一个分辨率选项进行比较",
    "controls.sensors": "选择要比较的传感器尺寸",
    "controls.empty.sensors": "请至少选择一个传感器尺寸进行比较",

    // Size Comparison
    "size.title": "尺寸比较",
    "size.stack": "堆叠模式",
    "size.about.title": "关于此比较",
    "size.about.description":
      "不同百万像素分辨率下相机传感器相对尺寸的可视化比较。",

    // Sensor Comparison
    "sensor.title": "传感器尺寸比较",
    "sensor.stack": "堆叠模式",
    "sensor.about.title": "关于传感器尺寸",
    "sensor.about.description":
      "不同相机传感器尺寸的可视化比较。较大的传感器通常能提供更好的图像质量和低光性能。",

    // Image Gallery
    "gallery.title": "图像库",
    "gallery.about.title": "关于图像库",
    "gallery.about.description":
      "展示不同百万像素分辨率之间模拟清晰度差异的示例图像。",

    // Focal Length
    "focal.title": "焦距可视化工具",
    "focal.length": "焦距：",
    "focal.fov": "视场角：",
    "focal.mm": "毫米",
    "focal.degrees": "°",
    "focal.selected": "选定区域",
    "focal.appears": "这显示了场景在以下焦距下的呈现效果：",
    "focal.click": "点击图像任意位置移动红色矩形框",
    "focal.about.title": "关于焦距",
    "focal.about.description": "模拟焦距如何影响视场和摄影中的表观距离。",

    // Footer
    "footer.copyright": "© 2025 像素比较 - 数码相机规格比较工具",
    "footer.github": "在GitHub上查看",

    // Language
    "language.en": "English",
    "language.zh": "中文",
    "language.switch": "切换到",

    // Sensor names
    "sensor.medium-format": "中画幅",
    "sensor.full-frame": "全画幅 (35mm)",
    "sensor.aps-c": "APS-C画幅",
    "sensor.m43": "M4/3画幅",
    "sensor.1-inch": "1英寸画幅",
    "sensor.2-3-inch": "2/3英寸画幅",
    "sensor.1-1.7-inch": "1/1.7英寸画幅",
    "sensor.1-2.3-inch": "1/2.3英寸画幅",
    "sensor.1-3-inch": "1/3英寸画幅",
  },
};

export default translations;
