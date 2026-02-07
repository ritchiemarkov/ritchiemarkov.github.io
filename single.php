<?php
/**
 * Template per singolo articolo.
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
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'single-post' ); ?>>
				<header class="entry-header">
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="entry-thumbnail">
							<?php the_post_thumbnail( 'full', array( 'class' => 'entry-thumbnail__img' ) ); ?>
						</div>
					<?php endif; ?>

					<div class="entry-meta">
						<?php
						$categories = get_the_category();
						if ( ! empty( $categories ) ) :
							?>
							<div class="entry-categories">
								<?php foreach ( $categories as $category ) : ?>
									<a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>" class="badge badge-secondary">
										<?php echo esc_html( $category->name ); ?>
									</a>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</div>

					<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

					<div class="entry-meta entry-meta--single">
						<div class="entry-meta__author">
							<?php echo get_avatar( get_the_author_meta( 'ID' ), 32 ); ?>
							<div>
								<span class="text-sm font-medium"><?php the_author(); ?></span>
								<span class="text-sm text-muted-foreground">
									<?php starter_flavor_shadcn_posted_on(); ?>
									&middot;
									<?php
									printf(
										esc_html( _n( '%s min di lettura', '%s min di lettura', ceil( str_word_count( wp_strip_all_tags( get_the_content() ) ) / 200 ), 'flavor-starter-shadcn' ) ),
										ceil( str_word_count( wp_strip_all_tags( get_the_content() ) ) / 200 )
									);
									?>
								</span>
							</div>
						</div>
					</div>
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

				<footer class="entry-footer">
					<?php
					$tags = get_the_tags();
					if ( ! empty( $tags ) ) :
						?>
						<div class="entry-tags">
							<?php foreach ( $tags as $tag ) : ?>
								<a href="<?php echo esc_url( get_tag_link( $tag->term_id ) ); ?>" class="badge badge-outline">
									<?php echo esc_html( $tag->name ); ?>
								</a>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>

					<div class="entry-nav">
						<?php
						$prev_post = get_previous_post();
						$next_post = get_next_post();
						?>
						<?php if ( $prev_post ) : ?>
							<a href="<?php echo esc_url( get_permalink( $prev_post ) ); ?>" class="entry-nav__link entry-nav__link--prev">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
								<div>
									<span class="text-sm text-muted-foreground"><?php esc_html_e( 'Precedente', 'flavor-starter-shadcn' ); ?></span>
									<span class="text-sm font-medium"><?php echo esc_html( get_the_title( $prev_post ) ); ?></span>
								</div>
							</a>
						<?php endif; ?>
						<?php if ( $next_post ) : ?>
							<a href="<?php echo esc_url( get_permalink( $next_post ) ); ?>" class="entry-nav__link entry-nav__link--next">
								<div>
									<span class="text-sm text-muted-foreground"><?php esc_html_e( 'Successivo', 'flavor-starter-shadcn' ); ?></span>
									<span class="text-sm font-medium"><?php echo esc_html( get_the_title( $next_post ) ); ?></span>
								</div>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
							</a>
						<?php endif; ?>
					</div>
				</footer>
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
get_footer();
