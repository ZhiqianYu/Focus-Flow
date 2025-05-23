# Focus-Flow
Intelligent Study Timer Based on Neuroscience

# 🕒 多阶段随机提醒计时器

一个支持 **阶段计时**、**随机提醒短休息**、**阶段间休息** 的高可配置桌面计时工具。适合用在番茄工作法、自主学习、集中注意力训练等场景中。

---

## 📦 功能特性

- 自定义总时间、阶段时间、短休息、阶段休息；
- 随机提醒触发短休息；
- 提示音自定义，支持 `.mp3/.wav` 文件；
- 支持配置保存与加载；
- 打包为 `.exe` 后可离线运行；

---

## 🖥️ 界面截图

<img src="images/pic1.png" alt="软件界面" width="400"/>
<img src="images/pic2.png" alt="提示音设置" width="250"/>

---

## 🌟 使用理念

在阶段式学习中，合理的时间管理和科学的复习方法能够显著提升学习效率和记忆效果。**多阶段随机提醒计时器** 的设计灵感来源于以下理念：

- **随机提醒**：在每个学习阶段中，设置每隔 3-5 分钟的随机提醒。当提醒响起时，可以闭上眼睛，清空大脑，回顾刚才学习的内容。这一短暂的“复盘”可以帮助大脑快速整理信息，重新激活刚才激活过的神经通路。据研究表明，这种神经通路的激活速度是直接再次阅读知识点的 20 倍。这意味着，10s的时间通过这种技巧可以实现相当于3-5分钟高效复习的效果。

- **阶段时间**：学习阶段是较长时间的专注学习期。在阶段结束后，建议进行一次较长的休息，彻底放松大脑。这不仅有助于缓解大脑疲劳，还能进一步巩固记忆。

- **总时间**：可以根据一天的学习目标，设置多个学习阶段与休息时间的组合，达到科学高效的一天学习计划。

通过这种方法，**多阶段随机提醒计时器** 不仅是一个简单的时间管理工具，更是一个助力高效学习的好帮手。

---

## 🧪 使用方法

### ✅ 运行方式一：源码运行

1. 安装依赖：
    ```bash
    pip install pygame
    ```
2. 运行程序：
    ```bash
    python MultiStageRandomNotificationTimer.py
    ```
3. 放置配置文件 `config.json` ，提醒声音`notification`与程序同目录。

---

### ✅ 运行方式二：使用打包好的 `.exe`

> 下载发布页中的 `Multi Stage Random Notification Timer.exe`， 直接运行即可，如无法运行，则需要电脑上装有python。

## 📄 License

This software is licensed for **personal and non-commercial use only**.

For commercial use (including in companies, products, SaaS platforms), you must obtain a paid license. Please contact:

📧 yu-zhiqian@outlook.com  
🌐 [github.com/ZhiqianYu](https://github.com/ZhiqianYu)

Unauthorized commercial use is **strictly prohibited**.
