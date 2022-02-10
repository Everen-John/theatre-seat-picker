const Header = ({ movieName }) => {
	return (
		<div className='font-roboto bg-gradient-to-r from-orange-400 to-orange-300 text-xl p-3 font-medium shadow-md'>
			<h1 className=''>Choosing Seats for {movieName}</h1>
		</div>
	)
}

export default Header
