<?php
/**
 * Template part per mostrare i post nella griglia.
 *
 * @package Starter_Flavor_ShadCN
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'card card--post' ); ?>>
	<?php if ( has_post_thumbnail() ) : ?>
		<a href="<?php the_permalink(); ?>" class="card__thumbnail">
			<?php the_post_thumbnail( 'starter-flavor-shadcn-card', array( 'class' => 'card__thumbnail-img' ) ); ?>
		</a>
	<?php endif; ?>

	<div class="card__content">
		<div class="card__meta">
			<?php
			$categories = get_the_category();
			if ( ! empty( $categories ) ) :
				$category = $categories[0];
				?>
				<a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>" class="badge badge-secondary">
					<?php echo esc_html( $category->name ); ?>
				</a>
			<?php endif; ?>
			<span class="text-sm text-muted-foreground">
				<?php starter_flavor_shadcn_posted_on(); ?>
			</span>
		</div>

		<h2 class="card__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>

		<div class="card__excerpt text-muted-foreground">
			<?php the_excerpt(); ?>
		</div>

		<div class="card__footer">
			<div class="card__author">
				<?php echo get_avatar( get_the_author_meta( 'ID' ), 24 ); ?>
				<span class="text-sm"><?php the_author(); ?></span>
			</div>
			<a href="<?php the_permalink(); ?>" class="btn btn-ghost btn-sm">
				<?php esc_html_e( 'Leggi', 'flavor-starter-shadcn' ); ?>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
			</a>
		</div>
	</div>
</article>
