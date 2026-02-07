<?php
/**
 * Flavor Starter Theme - ShadCN
 *
 * @package Starter_Flavor_ShadCN
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'STARTER_FLAVOR_SHADCN_VERSION', '1.0.0' );
define( 'STARTER_FLAVOR_SHADCN_DIR', get_template_directory() );
define( 'STARTER_FLAVOR_SHADCN_URI', get_template_directory_uri() );

/**
 * Configurazione del tema.
 */
function starter_flavor_shadcn_setup() {
	load_theme_textdomain( 'flavor-starter-shadcn', STARTER_FLAVOR_SHADCN_DIR . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'custom-logo', array(
		'height'      => 40,
		'width'       => 160,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );

	set_post_thumbnail_size( 1200, 630, true );
	add_image_size( 'starter-flavor-shadcn-card', 600, 400, true );

	register_nav_menus( array(
		'primary' => esc_html__( 'Menu Principale', 'flavor-starter-shadcn' ),
		'footer'  => esc_html__( 'Menu Footer', 'flavor-starter-shadcn' ),
	) );
}
add_action( 'after_setup_theme', 'starter_flavor_shadcn_setup' );

/**
 * Registra le sidebar e le aree widget.
 */
function starter_flavor_shadcn_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'flavor-starter-shadcn' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Aggiungi widget qui.', 'flavor-starter-shadcn' ),
		'before_widget' => '<section id="%1$s" class="widget card %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title text-lg font-semibold mb-3">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Footer', 'flavor-starter-shadcn' ),
		'id'            => 'footer-1',
		'description'   => esc_html__( 'Area widget del footer.', 'flavor-starter-shadcn' ),
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="widget-title text-sm font-semibold mb-2 text-muted-foreground">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'starter_flavor_shadcn_widgets_init' );

/**
 * Carica gli stili e gli script.
 */
function starter_flavor_shadcn_scripts() {
	// Font Geist da Google Fonts
	wp_enqueue_style(
		'geist-font',
		'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap',
		array(),
		null
	);

	// Stile principale shadcn
	wp_enqueue_style(
		'starter-flavor-shadcn-style',
		STARTER_FLAVOR_SHADCN_URI . '/assets/css/shadcn.css',
		array( 'geist-font' ),
		STARTER_FLAVOR_SHADCN_VERSION
	);

	// WordPress style.css (richiesto)
	wp_enqueue_style(
		'starter-flavor-shadcn-wordpress',
		get_stylesheet_uri(),
		array( 'starter-flavor-shadcn-style' ),
		STARTER_FLAVOR_SHADCN_VERSION
	);

	// Script principale
	wp_enqueue_script(
		'starter-flavor-shadcn-main',
		STARTER_FLAVOR_SHADCN_URI . '/assets/js/main.js',
		array(),
		STARTER_FLAVOR_SHADCN_VERSION,
		true
	);

	// Passa dati al JavaScript
	wp_localize_script( 'starter-flavor-shadcn-main', 'starterFlavorShadcn', array(
		'ajaxUrl' => admin_url( 'admin-ajax.php' ),
		'siteUrl' => home_url( '/' ),
	) );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'starter_flavor_shadcn_scripts' );

/**
 * Lunghezza personalizzata dell'excerpt.
 */
function starter_flavor_shadcn_excerpt_length( $length ) {
	return 25;
}
add_filter( 'excerpt_length', 'starter_flavor_shadcn_excerpt_length' );

/**
 * Testo "continua a leggere" per l'excerpt.
 */
function starter_flavor_shadcn_excerpt_more( $more ) {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'starter_flavor_shadcn_excerpt_more' );

/**
 * Aggiunge classi personalizzate al body.
 */
function starter_flavor_shadcn_body_classes( $classes ) {
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}
	if ( is_singular() && ! is_front_page() ) {
		$classes[] = 'singular';
	}
	return $classes;
}
add_filter( 'body_class', 'starter_flavor_shadcn_body_classes' );

/**
 * Walker personalizzato per il menu di navigazione con stili shadcn.
 */
class Starter_Flavor_ShadCN_Nav_Walker extends Walker_Nav_Menu {
	public function start_lvl( &$output, $depth = 0, $args = null ) {
		$indent  = str_repeat( "\t", $depth );
		$output .= "\n$indent<ul class=\"sub-menu\">\n";
	}

	public function start_el( &$output, $data_object, $depth = 0, $args = null, $current_object_id = 0 ) {
		$item    = $data_object;
		$indent  = ( $depth ) ? str_repeat( "\t", $depth ) : '';
		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $class_names . '>';

		$atts           = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		$atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
		$atts['href']   = ! empty( $item->url ) ? $item->url : '';

		$link_class = 'nav-link';
		if ( in_array( 'current-menu-item', $classes, true ) ) {
			$link_class .= ' nav-link--active';
		}
		$atts['class'] = $link_class;

		$atts       = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );
		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( ! empty( $value ) ) {
				$value       = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

		$title = apply_filters( 'the_title', $item->title, $item->ID );
		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$item_output  = $args->before;
		$item_output .= '<a' . $attributes . '>';
		$item_output .= $args->link_before . $title . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}

/**
 * Funzione helper per mostrare la data formattata.
 */
function starter_flavor_shadcn_posted_on() {
	$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time>';
	if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated screen-reader-text" datetime="%3$s">%4$s</time>';
	}
	$time_string = sprintf(
		$time_string,
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( get_the_date() ),
		esc_attr( get_the_modified_date( DATE_W3C ) ),
		esc_html( get_the_modified_date() )
	);

	printf(
		'<span class="posted-on">%s</span>',
		$time_string
	);
}

/**
 * Funzione helper per mostrare l'autore.
 */
function starter_flavor_shadcn_posted_by() {
	printf(
		'<span class="byline"><span class="author vcard"><a class="url fn n" href="%1$s">%2$s</a></span></span>',
		esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
		esc_html( get_the_author() )
	);
}
