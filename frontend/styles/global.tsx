import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";
import pxToRem from "../utils/pxToRem";

export const GlobalStyles = createGlobalStyle`
	:root {
		--colour-background: ${theme.colours.white};
		--colour-background-alpha-80: ${theme.colours.whiteAlpha80};
		--colour-background-alpha-50: ${theme.colours.whiteAlpha50};
		--colour-background-alpha-20: ${theme.colours.whiteAlpha20};
		--colour-background-alpha-0: ${theme.colours.whiteAlpha0};
		--colour-foreground: ${theme.colours.black};
		--colour-foreground-alpha-80: ${theme.colours.blackAlpha80};
		--colour-foreground-alpha-50: ${theme.colours.blackAlpha50};
		--colour-foreground-alpha-20: ${theme.colours.blackAlpha20};
		--colour-foreground-alpha-0: ${theme.colours.blackAlpha0};
		--colour-grey: ${theme.colours.grey};
		--colour-white: ${theme.colours.white};
		--colour-black: ${theme.colours.black};
		--font-pressura: ${theme.fonts.gtPressura};
		--font-pressura-mono: ${theme.fonts.gtPressuraMono};
		--transition-speed-default: ${theme.transitionSpeed.default};
		--transition-speed-fast: ${theme.transitionSpeed.fast};
		--transition-speed-extra-fast: ${theme.transitionSpeed.extraFast};
		--transition-speed-slow: ${theme.transitionSpeed.slow};
		--transition-speed-extra-slow: ${theme.transitionSpeed.extraSlow};
		--transition-ease: cubic-bezier(0.65, 0, 0.35, 1);
	}

	* {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: none;
		list-style: none;
		background: none;
		outline: none;
		border-radius: 0;
		box-shadow: none;
	}

	.page-builder
	{
		transition: opacity 500ms ease;
	}

	.fade-page-builder-modules
	{
		.page-builder, .project-title
		{
			opacity: 0;
		}
	}

	.remove-footer {
		footer {
			display: none;
		}
	}

	.color-switch {
		transition: color var(--transition-speed-default) var(--transition-ease);
	}

	-webkit-text-size-adjust: 100%;

	::selection {
		background-color: var(--colour-background);
		color: var(--colour-foreground);
	}

	html {
		background: var(--colour-background);
		font-size: 16px;

		transition: background var(--transition-speed-default) var(--transition-ease);

		&.no-scroll {
			overflow-y: hidden;
			
			body {
				overflow-y: hidden;
			}
		}
	}

	body {
		position: relative;

		&.hide-cursor {
			cursor: none;
		}
	}

	input,
	textarea,
	select,
	button,
	label,
	body {
		font-family: var(--font-pressura);
		color: var(--colour-foreground);
		line-height: normal;
	}

	strong,
	b {
		font-weight: 900;
	}

	em {
		font-style: italic;
	}

	a {
		text-decoration: none;
		color: var(--colour-foreground);
	}

	button {
		cursor: pointer;
	}

	p,
	.type-p,
	a,
	button,
	div {
		font-size: ${pxToRem(24)};
		line-height: ${pxToRem(28)};

		@media ${theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(16)};
			line-height: ${pxToRem(22)};
		}

		* {
			font-size: ${pxToRem(24)};
			line-height: ${pxToRem(28)};

			@media ${theme.mediaBreakpoints.tabletPortrait} {
				font-size: ${pxToRem(16)};
				line-height: ${pxToRem(22)};
			}
		}
	}

	h1,
	.type-h1 {
		font-size: ${pxToRem(54)};
		line-height: ${pxToRem(60)};
		letter-spacing: -1.62px;
		font-weight: 400;
		font-family: var(--font-pressura);

		@media ${theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(32)};
			line-height: ${pxToRem(35)};
			letter-spacing: -0.96px;
		}

		* {
			font-size: ${pxToRem(54)};
			line-height: ${pxToRem(60)};
			letter-spacing: -1.62px;
			font-weight: 400;

			@media ${theme.mediaBreakpoints.tabletPortrait} {
				font-size: ${pxToRem(32)};
				line-height: ${pxToRem(35)};
				letter-spacing: -0.96px;
			}
		}
	}

	h2,
	.type-h2 {
		font-size: ${pxToRem(40)};
		line-height: ${pxToRem(44)};
		letter-spacing: -1.2px;	
		font-weight: 400;
		font-family: var(--font-pressura);
		
		@media ${theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(26)};
			line-height: ${pxToRem(28)};
			letter-spacing: -0.78px;
		}

		* {
			font-size: ${pxToRem(40)};
			line-height: ${pxToRem(44)};
			letter-spacing: -1.2px;	
			font-weight: 400;
			
			@media ${theme.mediaBreakpoints.tabletPortrait} {
				font-size: ${pxToRem(26)};
				line-height: ${pxToRem(28)};
				letter-spacing: -0.78px;
			}
		}
	}

	h3,
	.type-h3 {
		font-size: ${pxToRem(28)};
		line-height: ${pxToRem(32)};
		font-weight: 400;
		font-family: var(--font-pressura);

		@media ${theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(18)};
			line-height: ${pxToRem(20)};
		}

		* {
			font-size: ${pxToRem(28)};
			line-height: ${pxToRem(32)};
			font-weight: 400;

			@media ${theme.mediaBreakpoints.tabletPortrait} {
				font-size: ${pxToRem(18)};
				line-height: ${pxToRem(20)};
			}
		}
	}

	h4,
	.type-h4 {
		font-size: ${pxToRem(18)};
		line-height: ${pxToRem(22)};
		font-weight: 400;
		font-family: var(--font-pressura);

		@media ${theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(14)};
			line-height: ${pxToRem(17)};
			letter-spacing: -0.14px;
		}

		* {
			font-size: ${pxToRem(18)};
			line-height: ${pxToRem(22)};

			@media ${theme.mediaBreakpoints.tabletPortrait} {
				font-size: ${pxToRem(14)};
				line-height: ${pxToRem(17)};
				letter-spacing: -0.14px;
			}
		}
	}

	.type-mono-small {
		font-family: var(--font-pressura-mono);
		font-size: ${pxToRem(14)};
		line-height: ${pxToRem(16)};
		font-weight: 400;
		letter-spacing: -0.28px;

		@media ${theme.mediaBreakpoints.tabletPortrait} {
			font-size: ${pxToRem(12)};
			line-height: ${pxToRem(14)};
			letter-spacing: -0.24px;
		}

		* {
			font-family: var(--font-pressura-mono);
			font-size: ${pxToRem(14)};
			line-height: ${pxToRem(16)};
			font-weight: 400;
			letter-spacing: -0.28px;

			@media ${theme.mediaBreakpoints.tabletPortrait} {
				font-size: ${pxToRem(12)};
				line-height: ${pxToRem(14)};
				letter-spacing: -0.24px;
			}
		}
	}

	.type-mono {
		font-family: var(--font-pressura-mono) !important;

		* {
			font-family: var(--font-pressura-mono) !important;
		}
	}

	mux-player {
		--media-object-fit: contain;
		--media-object-position: center;
		--controls: none;
		--media-object-fit: cover;
		--media-object-position: center;
	}

	.view-element-fade-in
	{
		opacity: 0;

		transition: opacity var(--transition-speed-default) ease;

		&--in-view
		{
			opacity: 1;
		}
	}

	.view-element-difference
	{
		position: relative;

		img {
			transform: scale(1.03);

			transition: all var(--transition-speed-extra-slow) var(--transition-ease);
		}

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: var(--colour-white);
			mix-blend-mode: difference;
			z-index: 2;

			transition: all 1000ms ease 300ms !important;
		}


		&--in-view
		{
			img {
				transform: scale(1);
			}

			&::before {
				background: var(--colour-black);
			}
		}
	}

	.view-element-bottom-top
	{
		opacity: 0;
		transform: translateY(15px);

		transition: opacity var(--transition-speed-default) cubic-bezier(0.65, 0, 0.35, 1), transform var(--transition-speed-default) cubic-bezier(0.65, 0, 0.35, 1);

		&--in-view
		{
			opacity: 1;
			transform: translateY(0);
		}
	}

	.view-element-scale-up
	{
		transform: scale(0.95);
		opacity: 0;

		transition: opacity var(--transition-speed-default) ease, transform var(--transition-speed-default) ease;

		&--in-view
		{
			opacity: 1;
			transform: scale(1);
		}
	}

	.embla {
		overflow: hidden;
	}

	.embla__container {
		display: flex;
	}

	.embla__slide {
		min-width: 0;
	}

	.performance {
		-webkit-transform: translateZ(0);
		backface-visibility: hidden;
		perspective: 1000;
		transform: translate3d(0,0,0);
		transform: translateZ(0);
	}

	::placeholder {
		color: currentcolor;
		opacity: 1;
	}

	input[type="search"]::-webkit-search-decoration,
	input[type="search"]::-webkit-search-cancel-button,
	input[type="search"]::-webkit-search-results-button,
	input[type="search"]::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}

	input[type="hidden"] {
		display: none;
	}

	input,
	textarea,
	select {
		padding: 0.125rem 0;
		font-size: ${pxToRem(16)};
		width: 100%;
		appearance: none;
	}

	input::placeholder,
	textarea::placeholder {
		transition: all var(--transition-speed-default) var(--transition-ease);
	}

	textarea {
		min-height: 5rem;
	}

	label {
		display: inline-block;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	img,
	video {
		max-width: 100%;
		display: block;
		height: auto;
	}

	iframe {
		max-width: 100%;
		display: block;
	}


	html.lenis {
		height: auto;
	}

	.lenis.lenis-smooth {
		scroll-behavior: auto !important;
	}

	.lenis.lenis-smooth [data-lenis-prevent] {
		overscroll-behavior: contain;
	}

	.lenis.lenis-stopped {
		overflow: hidden;
	}

	.lenis.lenis-scrolling iframe {
		pointer-events: none;
	}
`;
