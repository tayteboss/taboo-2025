export type MediaType = {
  mediaType: "video" | "image";
  video: { asset: { playbackId: string } };
  image: { asset: { url: string; metadata: { lqip: string } }; alt: string };
  mobileImage?: { asset: { url: string; metadata: { lqip: string } } };
  mobileVideo?: { asset: { playbackId: string } };
  caption?: string;
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

export type HomePageType = {
  seoTitle: string;
  seoDescription: string;
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
  year: string;
  service: string;
  industry: string;
  gridThumbnailMedia: {
    asset: {
      url: string;
    };
  };
  gridThumbnailRatio: string;
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
      leftColumn: {
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
      rightColumn: {
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
    };
    statisticBlock: Array<{
      _key: string;
      value: number;
      description: string;
    }>;
  }>;
  relatedProjects: Array<{
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
  }>;
};
