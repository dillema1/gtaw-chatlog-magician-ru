class Changelog {
    constructor() {
        this.panel = document.getElementById('changelogPanel');
        this.tab = document.querySelector('.changelog-tab');
        this.items = document.querySelector('.changelog-items');
        this.entries = typeof CHANGELOG_ENTRIES !== 'undefined' ? CHANGELOG_ENTRIES : [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderEntries();
    }

    setupEventListeners() {
        // Клик по табу — открыть/закрыть
        this.tab.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });

        // Клик вне панели — закрыть
        document.addEventListener('click', (e) => {
            if (
                this.panel.classList.contains('open') &&
                !this.panel.contains(e.target) &&
                !this.tab.contains(e.target)
            ) {
                this.closePanel();
            }
        });

        // Escape — закрыть
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('open')) {
                this.closePanel();
            }
        });
    }

    togglePanel() {
        if (this.panel.classList.contains('open')) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.panel.classList.add('open');
        this.panel.setAttribute('aria-hidden', 'false');
        this.tab.setAttribute('aria-expanded', 'true');
    }

    closePanel() {
        this.panel.classList.remove('open');
        this.panel.setAttribute('aria-hidden', 'true');
        this.tab.setAttribute('aria-expanded', 'false');
    }

    renderEntries() {
        if (!this.entries.length) {
            this.items.innerHTML = '<p style="color:#95a5a6;text-align:center;padding:20px;">Обновлений пока нет.</p>';
            return;
        }

        this.items.innerHTML = this.entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(entry => this.createEntryElement(entry))
            .join('');
    }

    createEntryElement(entry) {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (entry.categories) {
            const title = entry.title
                ? `<h4 class="changelog-title">${entry.title}</h4>`
                : '';
            const categoriesHtml = Object.entries(entry.categories)
                .map(([categoryName, changes]) => `
                    <div class="changelog-category">
                        <h5 class="category-name">${categoryName}</h5>
                        <ul>
                            ${changes.map(change => `<li>${change}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');

            return `
                <div class="changelog-item">
                    <div class="changelog-date">${formattedDate}</div>
                    <div class="changelog-content">
                        ${title}
                        ${categoriesHtml}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="changelog-item">
                    <div class="changelog-date">${formattedDate}</div>
                    <div class="changelog-content">
                        <ul>
                            ${entry.changes.map(change => `<li>${change}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.changelog = new Changelog();
});
