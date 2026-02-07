<?php
/**
 * Template per i commenti.
 *
 * @package Starter_Flavor_ShadCN
 */

if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area">
	<?php if ( have_comments() ) : ?>
		<h2 class="comments-title text-xl font-semibold">
			<?php
			$comment_count = get_comments_number();
			printf(
				esc_html( _n( '%d commento', '%d commenti', $comment_count, 'flavor-starter-shadcn' ) ),
				absint( $comment_count )
			);
			?>
		</h2>

		<ol class="comment-list">
			<?php
			wp_list_comments( array(
				'style'       => 'ol',
				'short_ping'  => true,
				'avatar_size' => 40,
				'callback'    => 'starter_flavor_shadcn_comment',
			) );
			?>
		</ol>

		<?php
		the_comments_navigation( array(
			'prev_text' => esc_html__( 'Commenti precedenti', 'flavor-starter-shadcn' ),
			'next_text' => esc_html__( 'Commenti successivi', 'flavor-starter-shadcn' ),
		) );
		?>
	<?php endif; ?>

	<?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
		<p class="no-comments text-muted-foreground">
			<?php esc_html_e( 'I commenti sono chiusi.', 'flavor-starter-shadcn' ); ?>
		</p>
	<?php endif; ?>

	<?php
	comment_form( array(
		'class_form'    => 'comment-form',
		'title_reply'   => esc_html__( 'Lascia un commento', 'flavor-starter-shadcn' ),
		'label_submit'  => esc_html__( 'Pubblica commento', 'flavor-starter-shadcn' ),
		'class_submit'  => 'btn btn-default',
		'comment_field' => '<p class="comment-form-comment"><label for="comment" class="text-sm font-medium">' . esc_html__( 'Commento', 'flavor-starter-shadcn' ) . '</label><textarea id="comment" name="comment" class="input" rows="6" required></textarea></p>',
	) );
	?>
</div>

<?php
/**
 * Callback personalizzato per i commenti.
 */
function starter_flavor_shadcn_comment( $comment, $args, $depth ) {
	$tag = ( 'div' === $args['style'] ) ? 'div' : 'li';
	?>
	<<?php echo $tag; ?> id="comment-<?php comment_ID(); ?>" <?php comment_class( 'comment-item card' ); ?>>
		<article class="comment-body">
			<header class="comment-meta">
				<div class="comment-author vcard">
					<?php echo get_avatar( $comment, $args['avatar_size'] ); ?>
					<div>
						<?php printf( '<cite class="fn text-sm font-medium">%s</cite>', get_comment_author_link() ); ?>
						<a href="<?php echo esc_url( get_comment_link( $comment, $args ) ); ?>" class="comment-date text-sm text-muted-foreground">
							<time datetime="<?php comment_time( 'c' ); ?>">
								<?php
								printf(
									esc_html__( '%1$s alle %2$s', 'flavor-starter-shadcn' ),
									get_comment_date(),
									get_comment_time()
								);
								?>
							</time>
						</a>
					</div>
				</div>
			</header>

			<?php if ( '0' == $comment->comment_approved ) : ?>
				<p class="comment-awaiting-moderation badge badge-secondary">
					<?php esc_html_e( 'Il commento è in attesa di moderazione.', 'flavor-starter-shadcn' ); ?>
				</p>
			<?php endif; ?>

			<div class="comment-content prose">
				<?php comment_text(); ?>
			</div>

			<div class="comment-actions">
				<?php
				comment_reply_link( array_merge( $args, array(
					'add_below' => 'comment',
					'depth'     => $depth,
					'max_depth' => $args['max_depth'],
					'before'    => '<span class="reply">',
					'after'     => '</span>',
				) ) );

				edit_comment_link( esc_html__( 'Modifica', 'flavor-starter-shadcn' ), '<span class="edit-link">', '</span>' );
				?>
			</div>
		</article>
	<?php
}
