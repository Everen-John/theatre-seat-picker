import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<link rel='preconnect' href='https://fonts.googleapis.com' />
			<link rel='preconnect' href='https://fonts.gstatic.com' />
			<link
				href='https://fonts.googleapis.com/css2?family=Encode+Sans+Condensed:wght@100;200;300;400;500;600;700;800;900&family=Oswald:wght@200;300;400;500;600;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
				rel='stylesheet'
			></link>
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp
