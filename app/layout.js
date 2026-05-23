import './globals.css';

export const metadata = {
  title: 'FORGE — Elite Performance Gym, London',
  description: 'Forge your limits. Premium performance training in the heart of London. Strength, conditioning, and athletic excellence.',
  keywords: 'gym london, elite training, personal training, strength conditioning, performance gym',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
