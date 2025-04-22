export const mediaString = `
	media {
		...,
		mediaType,
		image {
			asset-> {
				url,
				metadata {
					lqip,
					dimensions {
						aspectRatio,
					},
				},
			},
			alt
		},
		video {
			asset-> {
				playbackId,
			},
		},
	},
`;

export const siteSettingsQueryString = `
	*[_type == 'siteSettings'][0] {
		socialLinks[] {
			title,
			link
		},
		contactEmail,
		contactPhone,
		address,
		addressUrl,
		footerMedia[] {
			...,
			asset-> {
				url,
			},
		},
		personalContacts[] {
			name,
			role,
			email,
			image {
				...,
				asset-> {
					url,
				},
			},
		},
	}
`;

export const homePageQueryString = `
	*[_type == 'homePage'][0] {
		referenceTitle,
		seoTitle,
		seoDescription,
		items[] {
			useProjectReference,
			title,
			project-> {
				client-> {
					title,
				},
				title,
				slug,
				service,
				industry,
				gridThumbnailMedia {
					${mediaString}
				},
				gridThumbnailRatio
			},
			year,
			media {
				${mediaString}
			},
			description,
			link,
		},
	}
`;

export const informationPageQueryString = `
	*[_type == 'informationPage'][0] {
		...,
		seoTitle,
		seoDescription,
		aboutUsSection {
			title,
			subtitle,
			description[] {
				...,
			}
		},
		statisticsSection {
			mediaBackground {
				${mediaString}
			},
			statistics[] {
				value,
				title
			}
		},
		principlesSection {
			title,
			subtitle,
			description[] {
				...,
			},
			list[] {
				title,
				description
			}
		},
		achievementsSection {
			title,
			subtitle,
			description,
			list[] {
				name,
				nominations,
				year,
				optionalLink
			}
		},
		teamSection {
			title,
			teamMembers[] {
				name,
				position,
				description,
				image {
					...,
					asset-> {
						url,
					},
				},
				socialLinks[] {
					title,
					link
				}
			}
		},
		howDoWeDoItSection {
			title,
			list[] {
				...,
				title,
			}
		},
		featuredClientLogosSection {
			...,
			logos[] {
				title,
				image {
					asset-> {
						url,
					},
				},
				link
			}
		}
	}
`;

export const workPageQueryString = `
	*[_type == "workPage"] {
		...,
		seoTitle,
		seoDescription,
	}
`;

export const simpleProjectListQueryString = `
	title,
	slug,
	client-> {
		title,
		image {
			asset-> {
				url,
			},
		},
	},
	year,
	service,
	industry,
	gridThumbnailMedia {
		${mediaString}
	},
	gridThumbnailRatio,
`;

export const projectListQueryString = `
	...,
	title,
	slug,
	client-> {
		_id,
		title,
	},
	year,
	service,
	industry,
	gridThumbnailMedia {
		${mediaString}
	},
	gridThumbnailRatio,
	pageBuilder[] {
		_key,
		component,
		fullMedia {
			ratio,
			caption,
			${mediaString}
		},
		twoColumn {
			ratio,
			leftColumn {
				blockType,
				contentBlock[] {
					_key,
					title,
					text
				},
				${mediaString}
				statisticBlock[] {
					_key,
					title,
					description
				}
			},
			rightColumn {
				blockType,
				contentBlock[] {
					_key,
					title,
					text
				},
				${mediaString}
				statisticBlock[] {
					_key,
					title,
					description
				}
			}
		},
		statisticBlock[] {
			_key,
			value,
			description
		}
	},
	relatedProjects[]-> {
		title,
		slug,
		client-> {
			title,
			image {
				asset-> {
					url,
				},
			},
		},
	},
`;

export const projectsQueryString = `
	*[_type == 'project'] | order(orderRank) [0...100] {
		${projectListQueryString}
	}
`;

export const simpleProjectsQueryString = `
	*[_type == 'project'] | order(orderRank) [0...100] {
		${simpleProjectListQueryString}
	}
`;
