<?php
/**
 * Template per la pagina 404.
 *
 * @package Starter_Flavor_ShadCN
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="container container--narrow">
		<section class="error-404 not-found">
			<div class="error-404__content">
				<span class="error-404__code">404</span>
				<h1 class="error-404__title">
					<?php esc_html_e( 'Pagina non trovata', 'flavor-starter-shadcn' ); ?>
				</h1>
				<p class="error-404__description text-muted-foreground">
					<?php esc_html_e( 'La pagina che stai cercando non esiste o è stata spostata.', 'flavor-starter-shadcn' ); ?>
				</p>
				<div class="error-404__actions">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-default">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
						<?php esc_html_e( 'Torna alla home', 'flavor-starter-shadcn' ); ?>
					</a>
				</div>

				<div class="error-404__search">
					<?php get_search_form(); ?>
				</div>
			</div>
		</section>
	</div>
</main>

<?php
get_footer();
