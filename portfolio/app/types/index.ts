export interface Skill {
  name: string;
  level?: number;
  iconLight: React.ReactElement;
  iconDark: React.ReactElement;
  description: { [key: string]: string };
  subSkills?: Array<{
    name: string;
    level?: number;
    iconLight?: React.ReactElement;
    iconDark?: React.ReactElement;
    description?: { [key: string]: string };
  }>;
}

export interface Certification {
  name: { [key: string]: string };
  date: string;
}

export interface ProfileData {
  name: string;
  title: { [key: string]: string };
  bio: { [key: string]: string };
  skills: Skill[];
  interests: { [key: string]: string[] };
  certifications: Certification[];
  contacts: {
    email: string;
    github?: string;
    x?: string;
  };
  avatar?: string;
}

export interface LocaleData {
  title: string;
  printButton: string;
  downloadVCard: string;
  interests: string;
  contacts: string;
  skills: string;
  certifications: string;
  emailLabel: string;
  githubLabel: string;
  xLabel: string;
  skillLevelBeginner: string;
  skillLevelIntermediate: string;
  skillLevelAdvanced: string;
  profileCardContent: {
    avatarAltText: string;
  };
  cards: {
    profile: {
      downloadVCard: string;
      printButton: string;
    };
    interests: {
      title: string;
    };
    contacts: {
      title: string;
      emailLabel: string;
      githubLabel: string;
      xLabel: string;
    };
    skills: {
      title: string;
    };
    certifications: {
      title: string;
    };
  };
  vCardError: string;
  vCardGenerateError: string;
}
