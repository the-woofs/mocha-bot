import './globals.css'

export const metadata = {
  title: 'Mocha Bot',
  description: 'idfk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
