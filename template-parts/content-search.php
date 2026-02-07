<?php
/**
 * Template part per mostrare i risultati di ricerca.
 *
 * @package Starter_Flavor_ShadCN
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'card card--search' ); ?>>
	<div class="card__content">
		<div class="card__meta">
			<span class="badge badge-outline"><?php echo esc_html( get_post_type_object( get_post_type() )->labels->singular_name ); ?></span>
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

		<a href="<?php the_permalink(); ?>" class="btn btn-ghost btn-sm">
			<?php esc_html_e( 'Leggi di più', 'flavor-starter-shadcn' ); ?>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
		</a>
	</div>
</article>
