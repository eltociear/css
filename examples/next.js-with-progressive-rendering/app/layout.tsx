import dynamic from 'next/dynamic'
import './globals.css'

const CSSProvider = dynamic(() => import('@master/css.react/CSSProvider'))

export const metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
            <body>
                <CSSProvider config={import('../master.css')}>
                    {children}
                </CSSProvider>
            </body>
        </html>
	)
}
