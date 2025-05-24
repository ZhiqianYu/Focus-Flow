import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DocumentHead = () => {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    // 更新文档标题
    document.title = t('document.title');
    
    // 更新描述元标签
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('document.description'));
    }
    
  }, [t, i18n.language]); // 当语言变化时重新运行
  
  return null; // 这个组件不渲染任何内容
};

export default DocumentHead;