<?php
/**
 * Template per le pagine statiche.
 *
 * @package Starter_Flavor_ShadCN
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="container container--narrow">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'single-page' ); ?>>
				<header class="entry-header">
					<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
				</header>

				<?php if ( has_post_thumbnail() ) : ?>
					<div class="entry-thumbnail">
						<?php the_post_thumbnail( 'full', array( 'class' => 'entry-thumbnail__img' ) ); ?>
					</div>
				<?php endif; ?>

				<div class="entry-content prose">
					<?php
					the_content();

					wp_link_pages( array(
						'before' => '<div class="page-links">' . esc_html__( 'Pagine:', 'flavor-starter-shadcn' ),
						'after'  => '</div>',
					) );
					?>
				</div>
			</article>

			<?php
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;

		endwhile;
		?>
	</div>
</main>

<?php
get_sidebar();
get_footer();
