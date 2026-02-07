/**
 * Flavor Starter Theme - ShadCN
 * Script principale (Vanilla JavaScript)
 */

(function () {
	'use strict';

	/* ----------------------------------------
	   DARK MODE
	   ---------------------------------------- */

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

			// Ascolta cambiamenti di sistema (solo se non c'è preferenza salvata)
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

	/* ----------------------------------------
	   MOBILE MENU
	   ---------------------------------------- */

	const MobileMenu = {
		init() {
			this.toggle = document.getElementById('mobile-menu-toggle');
			this.menu = document.getElementById('mobile-menu');
			if (!this.toggle || !this.menu) return;

			this.isOpen = false;

			this.toggle.addEventListener('click', () => this.toggleMenu());

			// Chiudi con Escape
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && this.isOpen) {
					this.closeMenu();
				}
			});

			// Chiudi al click fuori
			document.addEventListener('click', (e) => {
				if (
					this.isOpen &&
					!this.menu.contains(e.target) &&
					!this.toggle.contains(e.target)
				) {
					this.closeMenu();
				}
			});

			// Chiudi al resize se si passa a desktop
			window.addEventListener('resize', () => {
				if (window.innerWidth >= 768 && this.isOpen) {
					this.closeMenu();
				}
			});
		},

		toggleMenu() {
			this.isOpen ? this.closeMenu() : this.openMenu();
		},

		openMenu() {
			this.isOpen = true;
			this.menu.setAttribute('aria-hidden', 'false');
			this.toggle.setAttribute('aria-expanded', 'true');
			this.toggle.setAttribute(
				'aria-label',
				'Chiudi menu'
			);
		},

		closeMenu() {
			this.isOpen = false;
			this.menu.setAttribute('aria-hidden', 'true');
			this.toggle.setAttribute('aria-expanded', 'false');
			this.toggle.setAttribute(
				'aria-label',
				'Apri menu'
			);
		},
	};

	/* ----------------------------------------
	   SMOOTH SCROLL PER ANCHOR LINKS
	   ---------------------------------------- */

	const SmoothScroll = {
		init() {
			document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
				anchor.addEventListener('click', (e) => {
					const targetId = anchor.getAttribute('href');
					if (targetId === '#') return;

					const target = document.querySelector(targetId);
					if (!target) return;

					e.preventDefault();
					const headerHeight =
						document.querySelector('.site-header')?.offsetHeight ||
						0;

					window.scrollTo({
						top: target.offsetTop - headerHeight - 16,
						behavior: 'smooth',
					});
				});
			});
		},
	};

	/* ----------------------------------------
	   HEADER SCROLL BEHAVIOR
	   ---------------------------------------- */

	const HeaderScroll = {
		init() {
			this.header = document.querySelector('.site-header');
			if (!this.header) return;

			this.lastScroll = 0;
			this.scrollThreshold = 5;

			window.addEventListener('scroll', () => this.onScroll(), {
				passive: true,
			});
		},

		onScroll() {
			const currentScroll = window.scrollY;

			if (currentScroll <= 0) {
				this.header.classList.remove(
					'site-header--hidden',
					'site-header--scrolled'
				);
				return;
			}

			if (currentScroll > 60) {
				this.header.classList.add('site-header--scrolled');
			} else {
				this.header.classList.remove('site-header--scrolled');
			}

			if (
				Math.abs(currentScroll - this.lastScroll) < this.scrollThreshold
			) {
				return;
			}

			if (currentScroll > this.lastScroll && currentScroll > 200) {
				// Scroll giù
				this.header.classList.add('site-header--hidden');
			} else {
				// Scroll su
				this.header.classList.remove('site-header--hidden');
			}

			this.lastScroll = currentScroll;
		},
	};

	/* ----------------------------------------
	   INIZIALIZZAZIONE
	   ---------------------------------------- */

	function init() {
		ThemeManager.init();
		MobileMenu.init();
		SmoothScroll.init();
		HeaderScroll.init();
	}

	// Avvia quando il DOM è pronto
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
