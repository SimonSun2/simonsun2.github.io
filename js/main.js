/**
 * Apex Racing - 主JavaScript文件
 * 包含所有交互功能：导航、动画、表单等
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initForms();
    initFAQ();
    initGallery();
});

/**
 * 导航栏滚动效果
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 添加/移除滚动样式
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 高亮当前导航项
        highlightCurrentNavItem();
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * 高亮当前导航项
 */
function highlightCurrentNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let currentSection = '';
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

/**
 * 移动端菜单
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu a');
    
    if (!menuBtn || !mobileMenu) return;
    
    // 打开菜单
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭菜单
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
    
    // 点击链接后关闭菜单
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // 点击外部关闭菜单
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 滚动显示动画
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * 数字滚动动画
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const prefix = counter.getAttribute('data-prefix') || '';
                const duration = 2000; // 2秒
                
                animateCounter(counter, target, prefix, suffix, duration);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * 数字动画函数
 */
function animateCounter(element, target, prefix, suffix, duration) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutExpo 缓动函数
        const easeProgress = 1 - Math.pow(2, -10 * progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
        
        element.textContent = prefix + currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * 表单验证与提交
 */
function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                // 模拟提交成功
                showFormSuccess(form);
            }
        });
    });
}

/**
 * 表单验证
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const errorEl = field.parentElement.querySelector('.error-message');
        
        // 移除之前的错误状态
        field.classList.remove('error');
        if (errorEl) errorEl.remove();
        
        if (!value) {
            isValid = false;
            showFieldError(field, '此字段为必填项');
        } else if (field.type === 'email' && !isValidEmail(value)) {
            isValid = false;
            showFieldError(field, '请输入有效的邮箱地址');
        }
    });
    
    return isValid;
}

/**
 * 显示字段错误
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #E63946; font-size: 12px; margin-top: 4px; display: block;';
    
    field.parentElement.appendChild(errorEl);
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 显示表单提交成功
 */
function showFormSuccess(form) {
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class="fas fa-check-circle" style="font-size: 64px; color: #22c55e; margin-bottom: 20px;"></i>
            <h3 style="font-size: 24px; margin-bottom: 12px;">提交成功！</h3>
            <p style="color: var(--color-text-secondary);">我们会尽快与您联系，请保持关注。</p>
        </div>
    `;
    
    form.innerHTML = '';
    form.appendChild(successEl);
}

/**
 * FAQ手风琴
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // 关闭所有其他项
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // 切换当前项
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/**
 * 图片画廊
 */
function initGallery() {
    const galleryMain = document.querySelector('.gallery-main img');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    
    if (!galleryMain || galleryThumbs.length === 0) return;
    
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imgSrc = this.getAttribute('data-src');
            if (imgSrc) {
                galleryMain.src = imgSrc;
                
                // 更新激活状态
                galleryThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

/**
 * 倒计时组件
 */
function initCountdown(targetDate, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const target = new Date(targetDate).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const diff = target - now;
        
        if (diff <= 0) {
            element.innerHTML = '<span class="countdown-ended">已开始</span>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        element.innerHTML = `
            <div class="countdown-item"><span>${days}</span><label>天</label></div>
            <div class="countdown-item"><span>${hours}</span><label>时</label></div>
            <div class="countdown-item"><span>${minutes}</span><label>分</label></div>
            <div class="countdown-item"><span>${seconds}</span><label>秒</label></div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * 标签筛选
 */
function initFilter(containerSelector, itemSelector, tagSelector) {
    const container = document.querySelector(containerSelector);
    const items = document.querySelectorAll(itemSelector);
    const tags = document.querySelectorAll(tagSelector);
    
    if (!container || items.length === 0) return;
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新激活状态
            tags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选项目
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filter === 'all' || itemCategory === filter) {
                    item.style.display = '';
                    item.classList.add('fade-in-up');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in-up');
                }
            });
        });
    });
}

/**
 * 复制到剪贴板
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '已复制！';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

/**
 * 图片懒加载
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// 控制台欢迎信息
console.log('%cApex Racing', 'color: #D4AF37; font-size: 24px; font-weight: bold; font-family: Montserrat;');
console.log('%cPrecision. Partnership. Perseverance.', 'color: #CCCCCC; font-size: 14px; font-style: italic;');
