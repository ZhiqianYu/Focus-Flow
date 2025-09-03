// create-icns.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'png2icons';
const { createICNS, BILINEAR } = pkg;

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1024x1024 PNG 文件路径 - 应放在项目根目录下的 'icons-source' 文件夹
const inputFile = path.join(__dirname, 'icon-1024.png');
// 输出 .icns 文件路径
const outputFile = path.join(__dirname, 'public', 'assets', 'icons', 'icon.icns');

// 确保输出目录存在
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取并转换图片
fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error('读取图片失败:', err);
    return;
  }
  
  // 转换为ICNS
  const icns = createICNS(data, BILINEAR, 0);
  
  if (icns) {
    // 写入文件
    fs.writeFile(outputFile, icns, (err) => {
      if (err) {
        console.error('写入ICNS文件失败:', err);
        return;
      }
      console.log('ICNS文件创建成功:', outputFile);
    });
  } else {
    console.error('ICNS转换失败');
  }
});