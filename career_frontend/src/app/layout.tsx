import "../index.css";
import Providers from "./providers";

export const metadata = {
  title: "CareerDreamer",
  description: "AI-powered career discovery and guidance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
