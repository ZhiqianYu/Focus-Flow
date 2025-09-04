/**
 * 统一的设置管理器
 * 管理所有需要持久化的用户设置
 */

class SettingsManager {
  constructor() {
    this.storagePrefix = 'focusflow_';
  }

  // 获取完整的存储键名
  getStorageKey(key) {
    return this.storagePrefix + key;
  }

  // 通用设置获取方法
  getSetting(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(this.getStorageKey(key));
      if (value === null) return defaultValue;
      
      // 尝试解析JSON，如果失败则返回原始字符串
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.warn(`Failed to get setting ${key}:`, error);
      return defaultValue;
    }
  }

  // 通用设置保存方法
  setSetting(key, value) {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(this.getStorageKey(key), valueToStore);
      return true;
    } catch (error) {
      console.error(`Failed to set setting ${key}:`, error);
      return false;
    }
  }

  // 删除设置
  removeSetting(key) {
    try {
      localStorage.removeItem(this.getStorageKey(key));
      return true;
    } catch (error) {
      console.error(`Failed to remove setting ${key}:`, error);
      return false;
    }
  }

  // 清除所有应用设置
  clearAllSettings() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear all settings:', error);
      return false;
    }
  }

  // 获取所有应用设置
  getAllSettings() {
    const settings = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          const settingKey = key.replace(this.storagePrefix, '');
          settings[settingKey] = this.getSetting(settingKey);
        }
      }
      return settings;
    } catch (error) {
      console.error('Failed to get all settings:', error);
      return {};
    }
  }

  // 批量设置
  setMultipleSettings(settings) {
    const results = {};
    Object.entries(settings).forEach(([key, value]) => {
      results[key] = this.setSetting(key, value);
    });
    return results;
  }

  // 计时器相关设置
  getTimerConfig() {
    return this.getSetting('timerConfig', null);
  }

  setTimerConfig(config) {
    return this.setSetting('timerConfig', config);
  }

  // 音频相关设置
  getAudioSettings() {
    return {
      volume: this.getSetting('audioVolume', 0.3),
      preset: this.getSetting('audioPreset', 'piano')
    };
  }

  setAudioSettings(settings) {
    const results = {};
    if (settings.volume !== undefined) {
      results.volume = this.setSetting('audioVolume', settings.volume);
    }
    if (settings.preset !== undefined) {
      results.preset = this.setSetting('audioPreset', settings.preset);
    }
    return results;
  }

  // 白噪声相关设置
  getWhiteNoiseSettings() {
    return {
      type: this.getSetting('whiteNoiseType', 'off'),
      volume: this.getSetting('whiteNoiseVolume', 0.2)
    };
  }

  setWhiteNoiseSettings(settings) {
    const results = {};
    if (settings.type !== undefined) {
      results.type = this.setSetting('whiteNoiseType', settings.type);
    }
    if (settings.volume !== undefined) {
      results.volume = this.setSetting('whiteNoiseVolume', settings.volume);
    }
    return results;
  }

  // 语言设置
  getUserLanguage() {
    return this.getSetting('userLanguage', 'zh');
  }

  setUserLanguage(language) {
    return this.setSetting('userLanguage', language);
  }

  // 活跃预设
  getActivePreset() {
    return this.getSetting('activePreset', null);
  }

  setActivePreset(preset) {
    return this.setSetting('activePreset', preset);
  }

  // 预设配置管理 - 保存用户对预设的自定义修改
  getCustomPresetConfig(presetName) {
    return this.getSetting(`preset_${presetName}`, null);
  }

  setCustomPresetConfig(presetName, config) {
    return this.setSetting(`preset_${presetName}`, config);
  }

  // 获取所有自定义预设配置
  getAllCustomPresets() {
    const customPresets = {};
    const allSettings = this.getAllSettings();
    
    Object.keys(allSettings).forEach(key => {
      if (key.startsWith('preset_')) {
        const presetName = key.replace('preset_', '');
        customPresets[presetName] = allSettings[key];
      }
    });
    
    return customPresets;
  }

  // 删除特定预设的自定义配置（恢复默认）
  removeCustomPresetConfig(presetName) {
    return this.removeSetting(`preset_${presetName}`);
  }

  // 内置预设自定义名称管理
  getCustomPresetName(presetName) {
    return this.getSetting(`presetName_${presetName}`, null);
  }

  setCustomPresetName(presetName, customName) {
    return this.setSetting(`presetName_${presetName}`, customName);
  }

  removeCustomPresetName(presetName) {
    return this.removeSetting(`presetName_${presetName}`);
  }

  // 自定义预设管理
  getUserCustomPresets() {
    return this.getSetting('userCustomPresets', []);
  }

  addUserCustomPreset(presetData) {
    const currentPresets = this.getUserCustomPresets();
    if (currentPresets.length >= 2) {
      return false; // 最多2个自定义预设
    }
    
    const newPresets = [...currentPresets, presetData];
    return this.setSetting('userCustomPresets', newPresets);
  }

  removeUserCustomPreset(presetId) {
    const currentPresets = this.getUserCustomPresets();
    const updatedPresets = currentPresets.filter(p => p.id !== presetId);
    return this.setSetting('userCustomPresets', updatedPresets);
  }

  updateUserCustomPreset(presetId, presetData) {
    const currentPresets = this.getUserCustomPresets();
    const updatedPresets = currentPresets.map(p => 
      p.id === presetId ? { ...p, ...presetData } : p
    );
    return this.setSetting('userCustomPresets', updatedPresets);
  }

  // Safari安装指南是否已关闭
  getSafariGuideDismissed() {
    return this.getSetting('safariGuideDismissed', false);
  }

  setSafariGuideDismissed(dismissed = true) {
    return this.setSetting('safariGuideDismissed', dismissed);
  }

  // 检查本地存储是否可用
  isStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // 导出设置到JSON
  exportSettings() {
    const settings = this.getAllSettings();
    return JSON.stringify(settings, null, 2);
  }

  // 从JSON导入设置
  importSettings(jsonString) {
    try {
      const settings = JSON.parse(jsonString);
      return this.setMultipleSettings(settings);
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }

  // 获取存储使用情况（字节）
  getStorageUsage() {
    let totalSize = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          const value = localStorage.getItem(key);
          totalSize += key.length + (value ? value.length : 0);
        }
      }
      return totalSize;
    } catch {
      return 0;
    }
  }

  // 内置预设隐藏管理
  getHiddenBuiltinPresets() {
    return this.getSetting('hiddenBuiltinPresets', []);
  }

  hideBuiltinPreset(presetName) {
    const hiddenPresets = this.getHiddenBuiltinPresets();
    if (!hiddenPresets.includes(presetName)) {
      hiddenPresets.push(presetName);
      return this.setSetting('hiddenBuiltinPresets', hiddenPresets);
    }
    return true;
  }

  showBuiltinPreset(presetName) {
    const hiddenPresets = this.getHiddenBuiltinPresets();
    const index = hiddenPresets.indexOf(presetName);
    if (index > -1) {
      hiddenPresets.splice(index, 1);
      return this.setSetting('hiddenBuiltinPresets', hiddenPresets);
    }
    return true;
  }

  isBuiltinPresetHidden(presetName) {
    return this.getHiddenBuiltinPresets().includes(presetName);
  }
}

// 导出单例
const settingsManager = new SettingsManager();
export default settingsManager;