// i18n.js - 多语言支持
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

  createLangSwitcher() {
    // 检查是否已存在切换器
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

    // 添加样式
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
        transition: all 0.3s ease;
      }
      
      .lang-btn:hover {
        background: rgba(184, 134, 11, 0.1);
        color: var(--color-accent-gold, #B8860B);
      }
      
      .lang-btn.active {
        background: var(--color-accent-gold, #B8860B);
        color: #000;
      }
      
      .lang-divider {
        color: var(--color-text-secondary, #666);
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
