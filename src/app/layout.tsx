/**
 * Root layout (required by Next.js)
 */

export const metadata = {
  title: 'Arena Mock API',
  description: 'Mock API server for Arena frontend development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

