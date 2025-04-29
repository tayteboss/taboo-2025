export type MediaType = {
  media: {
    mediaType: "video" | "image";
    video: { asset: { playbackId: string } };
    image: { asset: { url: string; metadata: { lqip: string } }; alt: string };
    mobileImage?: { asset: { url: string; metadata: { lqip: string } } };
    mobileVideo?: { asset: { playbackId: string } };
    caption?: string;
  };
};

export type TransitionsType = {
  hidden: {
    opacity: number;
    transition: {
      duration: number;
    };
  };
  visible: {
    opacity: number;
    transition: {
      duration: number;
      delay?: number;
    };
  };
};

export type ButtonType = {
  url: string;
  pageReference: {
    _ref: string;
  };
  title: string;
};

export type SlugType = {
  current: string;
};

export type SiteSettingsType = {
  socialLinks: { title: string; link: string }[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  addressUrl: string;
  footerMedia: { asset: { url: string } }[];
  personalContacts: {
    name: string;
    email: string;
    role: string;
    image: {
      asset: {
        url: string;
      };
    };
  }[];
};

export type InformationPageType = {
  referenceTitle: string;
  seoTitle: string;
  seoDescription: string;
  aboutUsSection: {
    title: string;
    description: any[];
    subtitle: string;
  };
  statisticsSection: {
    mediaBackground: MediaType;
    statistics: Array<{
      value: string;
      title: string;
    }>;
  };
  principlesSection: {
    title: string;
    description: any[];
    subtitle: string;
    list: Array<{
      title: string;
      description: string;
    }>;
  };
  achievementsSection: {
    title: string;
    description: string;
    subtitle: string;
    list: Array<{
      name: string;
      nominations: string;
      year: string;
      optionalLink: string;
    }>;
  };
  teamSection: {
    title: string;
    teamMembers: Array<{
      name: string;
      position: string;
      image: {
        asset: {
          url: string;
        };
      };
      description: string;
      socialLinks: Array<{
        title: string;
        link: string;
      }>;
    }>;
  };
  howDoWeDoItSection: {
    title: string;
    list: Array<{
      title: string;
      itemList: Array<string>;
    }>;
  };
  featuredClientLogosSection: {
    logos: Array<{
      title: string;
      image: {
        asset: {
          url: string;
        };
      };
      link: string;
    }>;
  };
};

export type WorkPageType = {
  seoTitle: string;
  seoDescription: string;
};

export type CategoryType = { title: string; value: string; count: number };

export type HomePageType = {
  referenceTitle: string;
  seoTitle: string;
  seoDescription: string;
  items: Array<{
    useProjectReference: boolean;
    title?: string;
    project?: ProjectType;
    media?: MediaType;
    description?: string;
    link?: string;
    year?: string;
  }>;
  mobileHeroMedia?: MediaType;
};

export type ColumnType = {
  blockType: string;
  contentBlock: Array<{
    _key: string;
    title: string;
    text: string;
  }>;
  media: MediaType;
  statisticBlock: Array<{
    _key: string;
    title: string;
    description: string;
  }>;
};

export type ProjectType = {
  title: string;
  slug: SlugType;
  client: {
    title: string;
    image: {
      asset: {
        url: string;
      };
    };
  };
  nextProject?: ProjectType;
  projectIndex?: number;
  year: string;
  services: string;
  industries: string;
  gridThumbnailMedia: MediaType;
  gridThumbnailRatio: string;
  overviewStatistics: Array<{
    value: string;
    description: string;
  }>;
  overviewDescription: string;
  heroMedia: MediaType;
  pageBuilder: Array<{
    _key: string;
    component: string;
    fullMedia: {
      ratio: string;
      caption: string;
      media: MediaType;
    };
    twoColumn: {
      ratio: string;
      leftColumn: ColumnType;
      rightColumn: ColumnType;
    };
    statisticBlock: Array<{
      _key: string;
      value: number;
      description: string;
    }>;
  }>;
};
