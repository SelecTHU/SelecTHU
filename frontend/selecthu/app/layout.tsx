// app/layout.tsx

import Providers from "./components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 你可以在这里添加其他头部内容，如 meta 标签等 */}
      </head>
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}