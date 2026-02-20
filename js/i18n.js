// i18n.js - 多语言支持（增强版）
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'zh';
    this.translations = {};
    this.init();
  }

  async init() {
    try {
      const response = await fetch('js/i18n.json');
      this.translations = await response.json();
      this.updatePage();
      this.createLangSwitcher();
      this.autoTranslate();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('lang', lang);
      this.updatePage();
      this.updateLangSwitcher();
      this.autoTranslate();
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return value;
  }

  updatePage() {
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    // 更新页面标题
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      document.title = this.t(titleEl.getAttribute('data-i18n'));
    }

    // 更新 HTML lang 属性
    document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
  }

  // 自动翻译常见文本
  autoTranslate() {
    if (this.currentLang === 'zh') return; // 中文是默认语言

    const translations = {
      // 导航
      '首页': 'Home',
      '关于我们': 'About',
      '赛车展示': 'Cars',
      '技术中心': 'Tech',
      '赛事实绩': 'Racing',
      '核心成员': 'Team',
      '加入我们': 'Join',
      '联系我们': 'Contact',
      '赞助合作': 'Sponsors',
      
      // 常见按钮
      '了解更多': 'Learn More',
      '查看详情': 'View Details',
      '查看更多': 'View More',
      '查看全部': 'View All',
      '立即申请': 'Apply Now',
      '提交申请': 'Submit',
      '复制邮箱': 'Copy Email',
      
      // 状态标签
      '已结束': 'Ended',
      '进行中': 'Ongoing',
      '即将开始': 'Upcoming',
      '即将推出': 'Coming Soon',
      
      // 页脚
      '快速链接': 'Quick Links',
      '联系我们': 'Contact Us',
      '关注我们': 'Follow Us',
      '资源': 'Resources',
      
      // 表单
      '姓名': 'Name',
      '年级': 'Grade',
      '班级': 'Class',
      '联系方式': 'Contact',
      '邮箱': 'Email',
      '电话': 'Phone',
      '提交': 'Submit',
      '取消': 'Cancel',
      
      // 社团相关
      '社团活动室': 'Club Room',
      '活动时间': 'Activity Time',
      '设计与维护': 'Design & Maintenance'
    };

    // 遍历所有文本节点进行翻译
    this.translateTextNodes(document.body, translations);
  }

  translateTextNodes(element, translations) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (translations[text]) {
        node.textContent = node.textContent.replace(text, translations[text]);
      }
    }
  }

  createLangSwitcher() {
    if (document.querySelector('.lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.innerHTML = `
      <button class="lang-btn ${this.currentLang === 'zh' ? 'active' : ''}" data-lang="zh">中</button>
      <span class="lang-divider">|</span>
      <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
    `;

    // 添加到导航栏
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
      navbar.appendChild(switcher);
    }

    // 绑定事件
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.setLang(lang);
      });
    });

    this.addStyles();
  }

  updateLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLang);
    });
  }

  addStyles() {
    if (document.getElementById('i18n-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'i18n-styles';
    styles.textContent = `
      .lang-switcher {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 20px;
      }
      
      .lang-btn {
        background: transparent;
        border: 1px solid var(--color-accent-gold, #B8860B);
        color: var(--color-text-secondary, #ccc);
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      
      .lang-btn:hover {
        background: rgba(184, 134, 11, 0.2);
        color: var(--color-accent-gold, #B8860B);
      }
      
      .lang-btn.active {
        background: var(--color-accent-gold, #B8860B);
        color: #000;
      }
      
      .lang-divider {
        color: var(--color-text-secondary, #666);
        font-weight: 300;
      }
      
      @media (max-width: 768px) {
        .lang-switcher {
          margin-left: 10px;
        }
        .lang-btn {
          padding: 4px 8px;
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(styles);
  }
}

// 初始化
const i18n = new I18n();
