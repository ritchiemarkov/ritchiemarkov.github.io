/**
 * Starter Flavor Theme - ShadCN
 * Vanilla JavaScript
 */

(function () {
	'use strict';

	/* ---- DARK MODE ---- */

	const ThemeManager = {
		STORAGE_KEY: 'starter-flavor-shadcn-theme',
		DARK_CLASS: 'dark',

		init() {
			this.toggle = document.getElementById('theme-toggle');
			if (!this.toggle) return;

			this.applyStoredTheme();
			this.toggle.addEventListener('click', () => this.toggleTheme());
		},

		getStoredTheme() {
			return localStorage.getItem(this.STORAGE_KEY);
		},

		getSystemPreference() {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		},

		applyStoredTheme() {
			const stored = this.getStoredTheme();
			const theme = stored || this.getSystemPreference();

			if (theme === 'dark') {
				document.documentElement.classList.add(this.DARK_CLASS);
			} else {
				document.documentElement.classList.remove(this.DARK_CLASS);
			}

			if (!stored) {
				window
					.matchMedia('(prefers-color-scheme: dark)')
					.addEventListener('change', (e) => {
						if (!this.getStoredTheme()) {
							document.documentElement.classList.toggle(
								this.DARK_CLASS,
								e.matches
							);
						}
					});
			}
		},

		toggleTheme() {
			const isDark =
				document.documentElement.classList.toggle(this.DARK_CLASS);
			localStorage.setItem(
				this.STORAGE_KEY,
				isDark ? 'dark' : 'light'
			);
		},
	};

	/* ---- MOBILE MENU ---- */

	const MobileMenu = {
		init() {
			this.toggle = document.getElementById('mobile-menu-toggle');
			this.menu = document.getElementById('mobile-menu');
			if (!this.toggle || !this.menu) return;

			this.isOpen = false;

			this.toggle.addEventListener('click', () => this.toggleMenu());

			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && this.isOpen) this.closeMenu();
			});

			document.addEventListener('click', (e) => {
				if (
					this.isOpen &&
					!this.menu.contains(e.target) &&
					!this.toggle.contains(e.target)
				) {
					this.closeMenu();
				}
			});

			window.addEventListener('resize', () => {
				if (window.innerWidth >= 768 && this.isOpen) this.closeMenu();
			});
		},

		toggleMenu() {
			this.isOpen ? this.closeMenu() : this.openMenu();
		},

		openMenu() {
			this.isOpen = true;
			this.menu.setAttribute('aria-hidden', 'false');
			this.toggle.setAttribute('aria-expanded', 'true');
			this.toggle.setAttribute('aria-label', 'Chiudi menu');
		},

		closeMenu() {
			this.isOpen = false;
			this.menu.setAttribute('aria-hidden', 'true');
			this.toggle.setAttribute('aria-expanded', 'false');
			this.toggle.setAttribute('aria-label', 'Apri menu');
		},
	};

	/* ---- HEADER HIDE ON SCROLL ---- */

	const HeaderScroll = {
		init() {
			this.header = document.querySelector('.site-header');
			if (!this.header) return;

			this.lastScroll = 0;
			this.threshold = 5;

			window.addEventListener('scroll', () => this.onScroll(), {
				passive: true,
			});
		},

		onScroll() {
			const y = window.scrollY;

			if (y <= 0) {
				this.header.classList.remove('site-header--hidden', 'site-header--scrolled');
				return;
			}

			if (y > 60) {
				this.header.classList.add('site-header--scrolled');
			} else {
				this.header.classList.remove('site-header--scrolled');
			}

			if (Math.abs(y - this.lastScroll) < this.threshold) return;

			if (y > this.lastScroll && y > 200) {
				this.header.classList.add('site-header--hidden');
			} else {
				this.header.classList.remove('site-header--hidden');
			}

			this.lastScroll = y;
		},
	};

	/* ---- INIT ---- */

	function init() {
		ThemeManager.init();
		MobileMenu.init();
		HeaderScroll.init();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
