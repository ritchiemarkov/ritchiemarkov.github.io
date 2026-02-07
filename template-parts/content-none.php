<?php
/**
 * Template part per quando non ci sono risultati.
 *
 * @package Starter_Flavor_ShadCN
 */
?>

<section class="no-results not-found">
	<div class="no-results__content">
		<svg class="no-results__icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m11 8-3 3 3 3"/></svg>

		<header class="page-header">
			<h1 class="page-title">
				<?php esc_html_e( 'Nessun risultato trovato', 'flavor-starter-shadcn' ); ?>
			</h1>
		</header>

		<div class="page-content">
			<?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>
				<p class="text-muted-foreground">
					<?php
					printf(
						wp_kses(
							__( 'Pronto a pubblicare il tuo primo post? <a href="%1$s">Inizia qui</a>.', 'flavor-starter-shadcn' ),
							array( 'a' => array( 'href' => array() ) )
						),
						esc_url( admin_url( 'post-new.php' ) )
					);
					?>
				</p>
			<?php elseif ( is_search() ) : ?>
				<p class="text-muted-foreground">
					<?php esc_html_e( 'Nessun risultato corrisponde alla tua ricerca. Prova con termini diversi.', 'flavor-starter-shadcn' ); ?>
				</p>
				<?php get_search_form(); ?>
			<?php else : ?>
				<p class="text-muted-foreground">
					<?php esc_html_e( 'Non riusciamo a trovare quello che cerchi. Prova a usare la ricerca.', 'flavor-starter-shadcn' ); ?>
				</p>
				<?php get_search_form(); ?>
			<?php endif; ?>
		</div>
	</div>
</section>
