import { Download, Github, Mail, Printer, Twitter, Moon, Sun } from "lucide-react";
import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

interface Skill {
  name: string;
  level: number;
  icon: React.ReactElement;
  description: { [key: string]: string };
}

interface Certification {
  name: { [key: string]: string };
  date: string;
}

interface ProfileData {
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

interface LocaleData {
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

const locales: Record<"ja" | "en", LocaleData> = {
  ja: {
    title: "タイトル",
    printButton: "印刷",
    downloadVCard: "vCardをダウンロード",
    interests: "研究分野・興味",
    contacts: "連絡先",
    skills: "スキル",
    certifications: "資格",
    emailLabel: "メール",
    githubLabel: "GitHub",
    xLabel: "X (Twitter)",
    skillLevelBeginner: "初級",
    skillLevelIntermediate: "中級",
    skillLevelAdvanced: "上級",
    profileCardContent: {
      avatarAltText: "プロフィール画像",
    },
    cards: {
      profile: {
        downloadVCard: "vCardをダウンロード",
        printButton: "印刷",
      },
      interests: {
        title: "研究分野・興味",
      },
      contacts: {
        title: "連絡先",
        emailLabel: "メール",
        githubLabel: "GitHub",
        xLabel: "X (Twitter)",
      },
      skills: {
        title: "スキル",
      },
      certifications: {
        title: "資格",
      },
    },
    vCardError: "エラー: vCardの生成に必要な情報が不足しています。",
    vCardGenerateError: "vCardの生成中にエラーが発生しました。コンソールを確認してください。",
  },
  en: {
    title: "Title",
    printButton: "Print",
    downloadVCard: "Download vCard",
    interests: "Interests",
    contacts: "Contacts",
    skills: "Skills",
    certifications: "Certifications",
    emailLabel: "Email",
    githubLabel: "GitHub",
    xLabel: "X (Twitter)",
    skillLevelBeginner: "Beginner",
    skillLevelIntermediate: "Intermediate",
    skillLevelAdvanced: "Advanced",
    profileCardContent: {
      avatarAltText: "Profile Picture",
    },
    cards: {
      profile: {
        downloadVCard: "Download vCard",
        printButton: "Print",
      },
      interests: {
        title: "Interests",
      },
      contacts: {
        title: "Contacts",
        emailLabel: "Email",
        githubLabel: "GitHub",
        xLabel: "X (Twitter)",
      },
      skills: {
        title: "Skills",
      },
      certifications: {
        title: "Certifications",
      },
    },
    vCardError: "Error: Insufficient information to generate vCard.",
    vCardGenerateError: "An error occurred while generating the vCard. Check the console.",
  },
};

const VCARD_VERSION = "3.0";

// テーマコンテキストの作成
interface ThemeContextProps {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    textGray: string;
    textGrayDark: string;
    bgGrayLight: string;
    bgGrayDark: string;
    borderGray: string;
  };
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// テーマコンテキストの使用を強制するフック
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// スキルアイテムコンポーネント
const SkillItem: React.FC<{ skill: Skill; t: LocaleData; currentLocale: "ja" | "en" }> = ({
  skill,
  t,
  currentLocale,
}) => {
  const { isDark, colors } = useTheme();

  function getSkillLevelText(level: number, t: LocaleData) {
    if (level >= 80) {
      return t.skillLevelAdvanced;
    } else if (level >= 50) {
      return t.skillLevelIntermediate;
    } else {
      return t.skillLevelBeginner;
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* アイコンの色を動的に変更 */}
          {React.cloneElement(skill.icon, {
            className: `h-5 w-5 text-${colors.primary} print:text-black`,
          })}
          <span className="font-medium">{skill.name}</span>
        </div>
        <span className={`text-gray-600 dark:text-gray-400 print:text-black`}>
          {/* description を現在のロケールに基づいて表示 */}
          {skill.description[currentLocale] ||
            `${skill.level}% (${getSkillLevelText(skill.level, t)})`}
        </span>
      </div>
      {/* プログレスバーの色を動的に変更 */}
      <Progress
        value={skill.level}
        className={`h-2 print:bg-gray-200 ${isDark ? "bg-gray-700" : ""}`}
      />
    </div>
  );
};

// 資格情報コンポーネント
const CertificationItem: React.FC<{
  certification: Certification;
  currentLocale: "ja" | "en";
}> = ({ certification, currentLocale }) => {
  const { colors } = useTheme();

  // 日付のフォーマット関数
  const formatDate = (dateString: string, locale: "ja" | "en") => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: locale === "ja" ? "numeric" : "long",
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
  };

  // dateがISO 8601形式（YYYY-MM）であると仮定して、それをDateオブジェクトに変換
  const formattedDate = useMemo(() => {
    const [year, month] = certification.date.split("-").map(Number);
    const date = new Date(year, month - 1);
    return formatDate(date.toISOString().slice(0, 7), currentLocale);
  }, [certification.date, currentLocale]);

  return (
    <div
      className={`flex items-center justify-between rounded-lg p-4 print:bg-gray-100 dark:bg-${colors.bgGrayDark} border print:border-gray-300`}
    >
      {/* name を現在のロケールに基づいて表示 */}
      <span className="font-medium print:text-black">{certification.name[currentLocale]}</span>
      {/* フォーマットされた日付を表示 */}
      <span className="text-sm text-gray-600 dark:text-gray-400 print:text-black">
        {formattedDate}
      </span>
    </div>
  );
};

// プロフィールカードコンポーネント
const ProfileCard: React.FC<{
  profile: ProfileData;
  t: LocaleData;
  generateVCard: () => void;
  handlePrint: () => void;
  currentLocale: "ja" | "en";
}> = ({ profile, t, generateVCard, handlePrint, currentLocale }) => {
  const { isDark, colors } = useTheme();

  return (
    <Card
      className={`overflow-hidden print:shadow-none ${isDark ? `dark:bg-${colors.bgGrayDark} dark:text-white` : ""
        } print:border print:border-gray-300`}
    >
      <div
        className={`h-32 bg-gradient-to-r from-${colors.primary} to-${colors.secondary} print:h-16 print:bg-none`}
      />
      <div className="relative">
        <div className="absolute -top-16 left-4 print:-top-8">
          <div
            className={`h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg print:h-16 print:w-16 print:border-2 print:border-gray-300`}
          >
            <img
              src={profile.avatar || "/static/placeholder.png"}
              alt={t.profileCardContent.avatarAltText}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <CardContent className="pt-20 print:pt-12">
          <h2 className="text-2xl font-bold print:text-xl print:text-black">{profile.name}</h2>
          <p
            className={`text-${colors.textGray} dark:text-${colors.textGrayDark} print:text-black`}
          >
            {profile.title[currentLocale]}
          </p>
          <p
            className={`mt-4 text-${colors.textGray} dark:text-${colors.textGrayDark} print:text-black`}
          >
            {profile.bio[currentLocale]}
          </p>
          <div className="mt-4 flex gap-2 print-hide">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={generateVCard}
                    disabled={typeof window === "undefined" || !window.URL}
                  >
                    <Download className="h-4 w-4" />
                    {t.cards.profile.downloadVCard}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {typeof window === "undefined" || !window.URL
                      ? "サーバーサイドでは利用できません"
                      : t.cards.profile.downloadVCard}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handlePrint}
                    disabled={typeof window === "undefined" || !window.print}
                  >
                    <Printer className="h-4 w-4" />
                    {t.cards.profile.printButton}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {typeof window === "undefined" || !window.print
                      ? "サーバーサイドでは利用できません"
                      : t.cards.profile.printButton}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

// 興味カードコンポーネント
const InterestsCard: React.FC<{ interests: string[]; t: LocaleData }> = ({
  interests,
  t,
}) => {
  const { isDark, colors } = useTheme();

  return (
    <Card
      className={`print:shadow-none ${isDark ? `dark:bg-${colors.bgGrayDark} dark:text-white` : ""
        } border print:border-gray-300`}
    >
      <CardHeader>
        <CardTitle className="text-lg print:text-black">{t.cards.interests.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className={`rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 print:border print:border-${colors.borderGray} print:bg-white print:text-black dark:bg-blue-900 dark:text-blue-200`}
            >
              {interest}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 連絡先カードコンポーネント
const ContactsCard: React.FC<{
  contacts: ProfileData["contacts"];
  t: LocaleData;
}> = ({ contacts, t }) => {
  const { isDark, colors } = useTheme();

  return (
    <Card
      className={`print:shadow-none ${isDark ? `dark:bg-${colors.bgGrayDark} dark:text-white` : ""
        } border print:border-gray-300`}
    >
      <CardHeader>
        <CardTitle className="text-lg print:text-black">{t.cards.contacts.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <a
          href={`mailto:${contacts.email}`}
          className={`flex items-center gap-3 text-${colors.textGray} hover:text-${colors.primary} print:text-black dark:text-${colors.textGrayDark} print:hover:text-blue-500`}
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          <span>{t.cards.contacts.emailLabel}</span>
          <span className="break-all">{contacts.email}</span>
        </a>
        {contacts.github && (
          <a
            href={contacts.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 text-${colors.textGray} hover:text-${colors.primary} print:text-black dark:text-${colors.textGrayDark} print:hover:text-blue-500`}
          >
            <Github className="h-5 w-5" aria-hidden="true" />
            <span>{t.cards.contacts.githubLabel}</span>
            <span className="break-all">{contacts.github}</span>
          </a>
        )}
        {contacts.x && (
          <a
            href={contacts.x}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 text-${colors.textGray} hover:text-${colors.primary} print:text-black dark:text-${colors.textGrayDark} print:hover:text-blue-500`}
          >
            <Twitter className="h-5 w-5" aria-hidden="true" />
            <span>{t.cards.contacts.xLabel}</span>
            <span className="break-all">{contacts.x}</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
};

// スキルカードコンポーネント
const SkillsCard: React.FC<{
  skills: Skill[];
  t: LocaleData;
  currentLocale: "ja" | "en";
}> = ({ skills, t, currentLocale }) => {
  const { isDark, colors } = useTheme();

  return (
    <Card
      className={`print:shadow-none ${isDark ? `dark:bg-${colors.bgGrayDark} dark:text-white` : ""
        } border print:border-gray-300`}
    >
      <CardHeader>
        <CardTitle className="text-lg print:text-black">{t.cards.skills.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 print:space-y-4">
        {skills.map((skill) => (
          <SkillItem
            key={skill.name}
            skill={skill}
            t={t}
            currentLocale={currentLocale}
          />
        ))}
      </CardContent>
    </Card>
  );
};

// 資格カードコンポーネント
const CertificationsCard: React.FC<{
  certifications: Certification[];
  t: LocaleData;
  currentLocale: "ja" | "en";
}> = ({ certifications, t, currentLocale }) => {
  const { isDark, colors } = useTheme();

  return (
    <Card
      className={`print:shadow-none ${isDark ? `dark:bg-${colors.bgGrayDark} dark:text-white` : ""
        } border print:border-gray-300`}
    >
      <CardHeader>
        <CardTitle className="text-lg print:text-black">
          {t.cards.certifications.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {certifications.map((cert, index) => (
          <CertificationItem
            key={index}
            certification={cert}
            currentLocale={currentLocale}
          />
        ))}
      </CardContent>
    </Card>
  );
};

// メインコンポーネント
export default function Index() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("theme")) {
        return localStorage.getItem("theme") === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [currentLocale, setCurrentLocale] = useState<"ja" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("locale") as "ja" | "en") || "ja";
    }
    return "ja";
  });

  // テーマカラー
  const colors = useMemo(
    () => ({
      primary: "blue-500",
      secondary: "purple-600",
      textGray: "gray-600",
      textGrayDark: "gray-400",
      bgGrayLight: "gray-50",
      bgGrayDark: "gray-900",
      borderGray: "gray-200",
    }),
    []
  );

  // テーマコンテキストの値
  const themeContextValue: ThemeContextProps = useMemo(
    () => ({
      isDark,
      colors,
    }),
    [isDark, colors]
  );

  const t = useMemo(() => locales[currentLocale], [currentLocale]);

  // プロフィールデータ
  const profile: ProfileData = {
    name: "名前",
    title: {
      ja: "タイトル",
      en: "Title",
    },
    bio: {
      ja: "自己紹介",
      en: "Bio",
    },
    skills: [
    ],
    interests: {
      ja: ["興味"],
      en: ["Interests"],
    },
    certifications: [
      {
        name: {
          ja: "資格名",
          en: "Certification Name",
        },
        date: "YYYYY-MM",
      },
    ],
    contacts: {
      email: "URL",
      github: "URL",
      x: "URL",
    },
    avatar: "",
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", currentLocale);
    }
  }, [currentLocale]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        *, *::before, *::after {
          color: black !important;
          background-color: white !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        @page {
          size: A4;
          margin: 1cm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .print-hide {
          display: none !important;
        }
        .print-break-avoid {
          break-inside: avoid;
        }
        .container {
          max-width: none !important;
          padding: 0 !important;
        }
        .print-section-break {
          break-before: always;
        }
        .print\\:h-16 {
          height: 4rem;
        }
        .print\\:w-16 {
          width: 4rem;
        }
        .print\\:-top-8 {
          top: -2rem;
        }
        .print\\:pt-12 {
          padding-top: 3rem;
        }
        .print\\:bg-none {
          background: none !important;
        }
        .print\\:text-black {
          color: black !important;
        }
        .print\\:border-gray-300 {
          border-color: #d1d5db !important;
        }
        .print\\:hover\\:text-blue-500:hover {
          color: #2563eb !important;
        }
        .print\\:border {
          border-width: 1px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const generateVCard = () => {
    if (
      !profile.name ||
      !profile.title[currentLocale] ||
      !profile.contacts.email
    ) {
      alert(t.vCardError);
      return;
    }

    const vcard = `BEGIN:VCARD
VERSION:${VCARD_VERSION}
FN:${profile.name}
TITLE:${profile.title[currentLocale]}
EMAIL:${profile.contacts.email}
URL;type=${currentLocale === "ja" ? "Github" : "GitHub"}:${profile.contacts.github || ""
      }
URL;type=${currentLocale === "ja" ? "X" : "X (Twitter)"}:${profile.contacts.x || ""
      }
NOTE:${profile.bio[currentLocale]}
END:VCARD`;

    try {
      const blob = new Blob([vcard], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile.name}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("vCardの生成中にエラーが発生しました:", error);
      alert(t.vCardGenerateError);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div
        className={`min-h-screen ${isDark ? `dark bg-${colors.bgGrayDark}` : `bg-${colors.bgGrayLight}`
          } py-12 print:bg-white print:py-0 transition-colors duration-200`}
      >
        <div className="container mx-auto px-4 print:px-0">
          <div className="mb-4 flex justify-end gap-2 print-hide">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentLocale(currentLocale === "ja" ? "en" : "ja")
              }
              className={`text-${colors.textGray} dark:text-${colors.textGrayDark}`}
            >
              {currentLocale === "ja" ? "EN" : "日本語"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className={`text-${colors.textGray} dark:text-${colors.textGrayDark}`}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 print:gap-4">
            <div className="space-y-6 lg:col-span-1 print:space-y-4">
              <ProfileCard
                profile={profile}
                t={t}
                generateVCard={generateVCard}
                handlePrint={handlePrint}
                currentLocale={currentLocale}
              />
              <InterestsCard
                interests={profile.interests[currentLocale]}
                t={t}
              />
              <ContactsCard contacts={profile.contacts} t={t} />
            </div>
            <div className="space-y-6 lg:col-span-2 print:space-y-4">
              <SkillsCard
                skills={profile.skills}
                t={t}
                currentLocale={currentLocale}
              />
              <CertificationsCard
                certifications={profile.certifications}
                t={t}
                currentLocale={currentLocale}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}