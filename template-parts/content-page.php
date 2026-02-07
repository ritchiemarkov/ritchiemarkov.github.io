<?php
/**
 * Template part per mostrare il contenuto delle pagine.
 *
 * @package Starter_Flavor_ShadCN
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header>

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
