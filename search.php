<?php
/**
 * Template per i risultati della ricerca.
 *
 * @package Starter_Flavor_ShadCN
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="container">
		<header class="page-header">
			<h1 class="page-title">
				<?php
				printf(
					/* translators: %s: search query. */
					esc_html__( 'Risultati per: %s', 'flavor-starter-shadcn' ),
					'<span class="text-primary">' . get_search_query() . '</span>'
				);
				?>
			</h1>
		</header>

		<?php if ( have_posts() ) : ?>
			<div class="posts-grid">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/content', 'search' );
				endwhile;
				?>
			</div>

			<nav class="pagination">
				<?php
				the_posts_pagination( array(
					'mid_size'  => 2,
					'prev_text' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> ' . esc_html__( 'Precedente', 'flavor-starter-shadcn' ),
					'next_text' => esc_html__( 'Successivo', 'flavor-starter-shadcn' ) . ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
				) );
				?>
			</nav>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content', 'none' ); ?>
		<?php endif; ?>
	</div>
</main>

<?php
get_footer();
