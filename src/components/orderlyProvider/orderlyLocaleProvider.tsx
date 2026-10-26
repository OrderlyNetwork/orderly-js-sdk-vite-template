import { ReactNode, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  AsyncResources,
  getLocalePathFromPathname,
  i18n,
  importLocaleJsonModule,
  LocaleCode,
  LocaleEnum,
  LocaleJsonModule,
  LocaleProvider,
  parseI18nLang,
  registerDefaultResource,
} from "@orderly.network/i18n";
import { usePathWithoutLang } from "../../hooks/usePathWithoutLang";
import extendEnLocale from "../../locales/en.json";
import { getDocumentDirection, getDocumentLanguage } from "../../utils/locale";

// Register fallback messages before the first render, including SSR.
registerDefaultResource(extendEnLocale);

// Vite requires import.meta.glob patterns to be string literals.
const baseLoaders = import.meta.glob<LocaleJsonModule>(
  "/node_modules/@orderly.network/i18n/dist/locales/*.json",
);

const extendLoaders = import.meta.glob<LocaleJsonModule>(
  "../../locales/*.json",
);

async function loadBase(lang: LocaleCode): Promise<Record<string, string>> {
  const key = `/node_modules/@orderly.network/i18n/dist/locales/${lang}.json`;
  return importLocaleJsonModule(baseLoaders[key]);
}

async function loadExtend(lang: LocaleCode): Promise<Record<string, string>> {
  const key = `../../locales/${lang}.json`;
  return importLocaleJsonModule(extendLoaders[key]);
}

const resources: AsyncResources = async (lang) => {
  if (lang === LocaleEnum.en) {
    return extendEnLocale;
  }

  const [base, extend] = await Promise.all([loadBase(lang), loadExtend(lang)]);
  return { ...base, ...extend };
};

export const OrderlyLocaleProvider = (props: { children: ReactNode }) => {
  const path = usePathWithoutLang();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search, hash } = location;

  const onLanguageChanged = useCallback(
    async (lang: LocaleCode) => {
      navigate(`/${lang}${path}${search}${hash}`, { replace: true });
    },
    [hash, navigate, path, search],
  );

  useEffect(() => {
    const lang =
      getLocalePathFromPathname(pathname) ?? parseI18nLang(i18n.language);
    document.documentElement.lang = getDocumentLanguage(lang);
    document.documentElement.dir = getDocumentDirection(lang);
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [pathname]);

  return (
    <LocaleProvider resources={resources} onLanguageChanged={onLanguageChanged}>
      {props.children}
    </LocaleProvider>
  );
};
