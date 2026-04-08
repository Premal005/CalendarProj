import './globals.css';

export const metadata = {
  title: 'Wall Calendar | Interactive Date Range Picker',
  description: 'A beautifully crafted interactive wall calendar component with date range selection, integrated notes, seasonal themes, and responsive design.',
  keywords: 'calendar, wall calendar, date picker, range selector, interactive, react, nextjs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
