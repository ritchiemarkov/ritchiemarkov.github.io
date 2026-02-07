<?php
/**
 * Form di ricerca personalizzato.
 *
 * @package Starter_Flavor_ShadCN
 */
?>

<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="search-field">
		<?php esc_html_e( 'Cerca:', 'flavor-starter-shadcn' ); ?>
	</label>
	<div class="search-form__inner">
		<svg class="search-form__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
		<input
			type="search"
			id="search-field"
			class="input search-form__input"
			placeholder="<?php esc_attr_e( 'Cerca...', 'flavor-starter-shadcn' ); ?>"
			value="<?php echo get_search_query(); ?>"
			name="s"
		>
		<button type="submit" class="btn btn-default search-form__submit">
			<?php esc_html_e( 'Cerca', 'flavor-starter-shadcn' ); ?>
		</button>
	</div>
</form>
