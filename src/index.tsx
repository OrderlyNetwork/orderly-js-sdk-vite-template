import React from "react";
import ReactDOM from "react-dom/client";
import {
  getLocalePathFromPathname,
  i18n,
  parseI18nLang,
} from "@orderly.network/i18n";
import { createAppRouter } from "./appRouter";
import { migratePredictionPath } from "./navigationPaths";
import AppRoute from "./routes";
import "./styles/index.css";

function bootstrap() {
  const { pathname, search, hash } = window.location;
  if (pathname !== "/" && !getLocalePathFromPathname(pathname)) {
    const locale = parseI18nLang(i18n.language);
    window.location.replace(
      `/${locale}${migratePredictionPath(pathname)}${search}${hash}`,
    );
    return;
  }

  const router = createAppRouter();
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <AppRoute router={router} />
    </React.StrictMode>,
  );
}

bootstrap();
