class SnowEffect {
    constructor() {
        this.container = document.getElementById('snow-container');
        this.snowflakes = [];
        this.init();
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.createSnowflake();
        }
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        
        const size = Math.random() * 3 + 2;
        const startingX = Math.random() * window.innerWidth;
        const timeToFall = Math.random() * 3 + 2;
        const delay = Math.random() * 2;

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${startingX}px`;
        snowflake.style.animationDuration = `${timeToFall}s`;
        snowflake.style.animationDelay = `${delay}s`;

        this.container.appendChild(snowflake);

        
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
            this.createSnowflake();
        });
    }
}

class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            
            if (currentScrollY > this.lastScrollY) {
                this.navbar.classList.add('hidden');
            } else {
                this.navbar.classList.remove('hidden');
            }

            
            if (currentScrollY < 50) {
                this.navbar.classList.add('transparent');
            } else {
                this.navbar.classList.remove('transparent');
            }

            this.lastScrollY = currentScrollY;
        });
    }
}

class ExploitStatusTracker {
    constructor() {
        this.exploitsData = [];
        this.versionData = {};
        this.updateCountdown = 60;
        this.init();
    }

    async init() {
        await Promise.all([
            this.fetchExploitsData(),
            this.fetchVersionData()
        ]);
        this.render();
        this.startAutoRefresh();
        this.initFAQ();
        new SnowEffect();
        new NavbarManager();
        this.startCountdown();
    }

    async fetchExploitsData() {
        try {
            const response = await fetch('https://weao.xyz/api/status/exploits?t=' + Date.now());
            this.exploitsData = await response.json();
        } catch (error) {
            console.error('Error fetching exploits data:', error);
        }
    }

    async fetchVersionData() {
        try {
            const response = await fetch('https://weao.xyz/api/versions/current?t=' + Date.now());
            this.versionData = await response.json();
        } catch (error) {
            console.error('Error fetching version data:', error);
        }
    }

    updateVersionsUI() {
        
        document.getElementById('windows-version').textContent = this.versionData.Windows || 'N/A';
        document.getElementById('windows-date').textContent = this.versionData.WindowsDate || 'N/A';

        
        document.getElementById('mac-version').textContent = this.versionData.Mac || 'N/A';
        document.getElementById('mac-date').textContent = this.versionData.MacDate || 'N/A';
    }

    createExploitCard(exploit) {
        console.log('Creating card for exploit:', exploit); 
        const card = document.createElement('div');
        card.className = 'exploit-card fade-in';
        
        const statusBadges = [];
        if (exploit.uncStatus) statusBadges.push(`
            <span class="badge badge-error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                UNC
            </span>
        `);
        if (exploit.detected) statusBadges.push(`
            <span class="badge badge-warning">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                WARNING
            </span>
        `);
        if (exploit.updateStatus) statusBadges.push(`
            <span class="badge badge-success">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                Updated
            </span>
        `);
        if (exploit.verified) statusBadges.push(`
            <span class="badge badge-verified">
                <span class="logo">
                    <img src="https://iili.io/24CK8ZX.md.png" alt="Component Logo" />
                </span>
                <span class="text">Verified</span>
            </span>
        `);
        
        card.innerHTML = `
            <div class="exploit-header">
                <h3 class="exploit-title">${exploit.title}</h3>
                <span class="exploit-version">${exploit.version}</span>
            </div>
            <div class="exploit-badges">
                ${statusBadges.join('')}
                ${exploit.platform ? `
                    <span class="badge badge-success">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        ${exploit.platform}
                    </span>
                ` : ''}
                ${exploit.free ? `
                    <span class="badge badge-success">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        Free
                    </span>
                ` : ''}
                ${exploit.cost ? `
                    <span class="badge badge-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        ${exploit.cost}
                    </span>
                ` : ''}
            </div>
            <div class="exploit-info">
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Last Updated: ${exploit.updatedDate}
                </p>
                ${exploit.rbxversion ? `
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                            <line x1="16" y1="8" x2="2" y2="22"/>
                            <line x1="17.5" y1="15" x2="9" y2="15"/>
                        </svg>
                        Roblox Version: ${exploit.rbxversion}
                    </p>
                ` : ''}
            </div>
            <div class="exploit-links">
                ${exploit.websitelink ? `
                    <a href="${exploit.websitelink}" target="_blank" class="exploit-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Website
                    </a>
                ` : ''}
                ${exploit.discordlink ? `
                    <a href="${exploit.discordlink}" target="_blank" class="exploit-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Discord
                    </a>
                ` : ''}
                ${exploit.purchaselink ? `
                    <a href="${exploit.purchaselink}" target="_blank" class="exploit-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Purchase
                    </a>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    createStatusBadge(status) {
        console.log('Creating status badge for:', status); 
        const badge = document.createElement('div');
        badge.className = 'status-badge';
        badge.classList.add(status.toLowerCase());
        
        if (status === 'Detected' || status === 'Patched') {
            console.log('Creating warning tooltip for:', status); 
            const warningContainer = document.createElement('div');
            warningContainer.className = 'status-warning';
            
            const warningText = document.createElement('span');
            warningText.className = 'warning-text';
            warningText.textContent = 'WARNING';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'warning-tooltip';
            tooltip.textContent = 'This exploit might be detected, use at your own risk.';
            
            warningContainer.appendChild(warningText);
            warningContainer.appendChild(tooltip);
            badge.appendChild(warningContainer);
            
            console.log('Warning tooltip structure:', warningContainer.outerHTML); 
        } else {
            badge.textContent = status;
        }
        
        return badge;
    }

    updateExploitsUI() {
        
        const grids = {
            'windows-executors-grid': this.exploitsData.filter(e => e.platform === 'Windows' && e.extype === 'wexecutor'),
            'mac-executors-grid': this.exploitsData.filter(e => e.platform === 'Mac' && e.extype === 'mexecutor'),
            'android-executors-grid': this.exploitsData.filter(e => e.platform === 'Android' && e.extype === 'aexecutor'),
            'externals-grid': this.exploitsData.filter(e => e.extype === 'wexternal')
        };

        for (const [gridId, exploits] of Object.entries(grids)) {
            const grid = document.getElementById(gridId);
            if (!grid) continue;

            grid.innerHTML = '';
            
            
            const sortedExploits = [...exploits].sort((a, b) => {
                
                const indexA = typeof a.index === 'number' ? a.index : 0;
                const indexB = typeof b.index === 'number' ? b.index : 0;
                return indexA - indexB;
            });

            sortedExploits.forEach(exploit => {
                const card = this.createExploitCard(exploit);
                grid.appendChild(card);
            });
        }
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0';
                    }
                });
                
                
                item.classList.toggle('active');
                answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
            });
        });
    }

    startCountdown() {
        const countdownElement = document.getElementById('update-countdown');
        
        setInterval(() => {
            this.updateCountdown--;
            if (this.updateCountdown <= 0) {
                this.updateCountdown = 60;
            }
            countdownElement.textContent = this.updateCountdown;
        }, 1000);
    }

    updateStatistics() {
        const stats = {
            windows: 0,
            mac: 0,
            android: 0,
            total: this.exploitsData.length
        };

        this.exploitsData.forEach(exploit => {
            if (exploit.platform === 'Windows') stats.windows++;
            else if (exploit.platform === 'Mac') stats.mac++;
            else if (exploit.platform === 'Android') stats.android++;
        });

        document.getElementById('windows-count').textContent = stats.windows;
        document.getElementById('mac-count').textContent = stats.mac;
        document.getElementById('android-count').textContent = stats.android;
        document.getElementById('total-count').textContent = stats.total;
    }

    render() {
        this.updateVersionsUI();
        this.updateExploitsUI();
        this.updateStatistics();
    }

    startAutoRefresh() {
        setInterval(async () => {
            await Promise.all([
                this.fetchExploitsData(),
                this.fetchVersionData()
            ]);
            this.render();
        }, 60000); 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ExploitStatusTracker();

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
});
