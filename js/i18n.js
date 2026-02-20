// i18n.js - 简化的语言切换（使用浏览器/Google翻译）
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'zh';
    this.init();
  }

  init() {
    this.createLangSwitcher();
    
    // 如果之前选择了英文，自动触发翻译
    if (this.currentLang === 'en') {
      this.translateToEnglish();
    }
  }

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.updateLangSwitcher();
    
    if (lang === 'en') {
      this.translateToEnglish();
    } else {
      this.restoreChinese();
    }
  }

  translateToEnglish() {
    // 方法1: 使用 Google Translate 嵌入
    if (!document.getElementById('google-translate')) {
      this.loadGoogleTranslate();
    }
    
    // 方法2: 提示用户使用浏览器翻译
    this.showTranslateHint();
  }

  loadGoogleTranslate() {
    const script = document.createElement('script');
    script.id = 'google-translate';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
    
    window.googleTranslateElementInit = () => {
      new google.translate.TranslateElement({
        pageLanguage: 'zh-CN',
        includedLanguages: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google-translate-container');
    };
  }

  showTranslateHint() {
    // 创建提示条
    let hint = document.getElementById('translate-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.id = 'translate-hint';
      hint.innerHTML = `
        <div style="
          position: fixed;
          top: 80px;
          right: 20px;
          background: rgba(184, 134, 11, 0.95);
          color: #000;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          max-width: 300px;
        ">
          <div style="font-weight: bold; margin-bottom: 4px;">🌐 切换到英文</div>
          <div style="font-size: 12px; opacity: 0.9;">
            请使用浏览器翻译功能：<br>
            Chrome: 右键 → "翻译成英语"<br>
            Safari: 地址栏 → 翻译图标
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            margin-top: 8px;
            background: #000;
            color: #fff;
            border: none;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">知道了</button>
        </div>
      `;
      document.body.appendChild(hint);
      
      // 3秒后自动消失
      setTimeout(() => {
        hint?.remove();
      }, 8000);
    }
  }

  restoreChinese() {
    // 移除 Google Translate
    const gt = document.getElementById('google-translate');
    if (gt) gt.remove();
    
    // 移除提示
    const hint = document.getElementById('translate-hint');
    if (hint) hint.remove();
    
    // 刷新页面恢复中文
    location.reload();
  }

  createLangSwitcher() {
    if (document.querySelector('.lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.innerHTML = `
      <button class="lang-btn ${this.currentLang === 'zh' ? 'active' : ''}" data-lang="zh" title="中文">
        中
      </button>
      <span class="lang-divider">|</span>
      <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English (Auto Translate)">
        EN
      </button>
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
      
      /* Google Translate 样式覆盖 */
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(styles);
  }
}

// 初始化
const i18n = new I18n();
