<?php
/**
 * Header del tema.
 *
 * @package Starter_Flavor_ShadCN
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary">
		<?php esc_html_e( 'Vai al contenuto', 'flavor-starter-shadcn' ); ?>
	</a>

	<header id="masthead" class="site-header">
		<div class="container">
			<div class="site-header__inner">
				<!-- Logo / Site Branding -->
				<div class="site-branding">
					<?php if ( has_custom_logo() ) : ?>
						<?php the_custom_logo(); ?>
					<?php else : ?>
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home">
							<?php bloginfo( 'name' ); ?>
						</a>
					<?php endif; ?>
				</div>

				<!-- Navigazione principale -->
				<nav id="site-navigation" class="main-navigation" aria-label="<?php esc_attr_e( 'Menu Principale', 'flavor-starter-shadcn' ); ?>">
					<?php
					wp_nav_menu( array(
						'theme_location' => 'primary',
						'menu_id'        => 'primary-menu',
						'menu_class'     => 'nav-menu',
						'container'      => false,
						'walker'         => new Starter_Flavor_ShadCN_Nav_Walker(),
						'fallback_cb'    => false,
					) );
					?>
				</nav>

				<!-- Azioni header: dark mode + menu mobile -->
				<div class="site-header__actions">
					<button
						id="theme-toggle"
						class="btn btn-ghost btn-icon"
						aria-label="<?php esc_attr_e( 'Cambia tema', 'flavor-starter-shadcn' ); ?>"
						type="button"
					>
						<svg class="icon icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
						<svg class="icon icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
					</button>

					<button
						id="mobile-menu-toggle"
						class="btn btn-ghost btn-icon mobile-menu-toggle"
						aria-label="<?php esc_attr_e( 'Apri menu', 'flavor-starter-shadcn' ); ?>"
						aria-expanded="false"
						type="button"
					>
						<svg class="icon icon-menu" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
						<svg class="icon icon-x" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					</button>
				</div>
			</div>

			<!-- Menu mobile (nascosto di default) -->
			<div id="mobile-menu" class="mobile-menu" aria-hidden="true">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'primary',
					'menu_id'        => 'mobile-primary-menu',
					'menu_class'     => 'mobile-nav-menu',
					'container'      => false,
					'walker'         => new Starter_Flavor_ShadCN_Nav_Walker(),
					'fallback_cb'    => false,
				) );
				?>
			</div>
		</div>
	</header>

	<div id="content" class="site-content">
