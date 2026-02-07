<?php
/**
 * Footer del tema.
 *
 * @package Starter_Flavor_ShadCN
 */
?>
	</div><!-- #content -->

	<footer id="colophon" class="site-footer">
		<div class="container">
			<div class="site-footer__inner">
				<div class="site-footer__branding">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-footer__logo" rel="home">
						<?php bloginfo( 'name' ); ?>
					</a>
					<p class="site-footer__description text-muted-foreground">
						<?php bloginfo( 'description' ); ?>
					</p>
				</div>

				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<nav class="footer-navigation" aria-label="<?php esc_attr_e( 'Menu Footer', 'flavor-starter-shadcn' ); ?>">
						<?php
						wp_nav_menu( array(
							'theme_location' => 'footer',
							'menu_id'        => 'footer-menu',
							'menu_class'     => 'footer-nav-menu',
							'container'      => false,
							'depth'          => 1,
						) );
						?>
					</nav>
				<?php endif; ?>

				<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
					<div class="site-footer__widgets">
						<?php dynamic_sidebar( 'footer-1' ); ?>
					</div>
				<?php endif; ?>
			</div>

			<div class="site-footer__bottom">
				<p class="text-sm text-muted-foreground">
					&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?>
					<?php bloginfo( 'name' ); ?>.
					<?php esc_html_e( 'Tutti i diritti riservati.', 'flavor-starter-shadcn' ); ?>
				</p>
			</div>
		</div>
	</footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
