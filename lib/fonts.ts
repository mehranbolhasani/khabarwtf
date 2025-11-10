import localFont from "next/font/local";

export const estedad = localFont({
  src: [
    {
      path: "../public/fonts/Estedad-FD-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Estedad-FD-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-estedad",
  display: "swap",
});

