const YourSeats = ({
	yourSeats,
	removeYourSeat,
	bookingFee,
	yourTotal,
	enableSubmit,
	setOpenBookingModal,
}) => {
	console.log(yourSeats)
	const seatTypeSwitch = (seat) => {
		switch (seat.seat.type) {
			case "STANDARD":
				return (
					<img
						className=' absolute'
						style={{ width: "3rem" }}
						src='/seats/standardSeat.svg'
					/>
				)
			case "VIP":
				return (
					<img
						className=' absolute'
						style={{ width: "3rem" }}
						src='/seats/VIPSeat.svg'
					/>
				)
			case "WHEELCHAIRSPACE":
				return (
					<img
						className=' absolute '
						style={{ width: "3rem" }}
						src='/seats/WheelchairSpace.svg'
					/>
				)
			case "RECLINER":
				return (
					<img
						className=' absolute'
						style={{ width: "3rem" }}
						src='/seats/TheRecliner.svg'
					/>
				)
		}
	}
	return (
		<div className='flex flex-col justify-center '>
			<div className='flex flex-row justify-between'>
				<p
					className='font-semibold font-sans text-3xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 mb-10'
					style={{ fontFamily: "'Oswald', sans-serif" }}
				>
					WHERE TO SIT?
				</p>
				<p className=' text-xs'>Add/remove tickets</p>
			</div>
			<div className=''>
				<div className='grid gap-3 grid-cols-4 md:grid-cols-5 lg:grid-cols-5 grid-flow-row z-0 relative mb-10 min-w-full'>
					{yourSeats.map((seat, index) => (
						<div
							key={seat.col + seat.seatLetter}
							className='h-10 relative cursor-pointer'
							onClick={(e) => {
								removeYourSeat(e, seat)
							}}
						>
							{seatTypeSwitch(seat)}
							<p className=' text-gray-700 z-10 relative left-3'>
								{seat.col + 1}
								{seat.seatLetter}
							</p>
						</div>
					))}
				</div>
				<p>{yourSeats.length} seats selected</p>
			</div>
			<div className='bg-gray-300 w-full h-1'></div>
			<div className='flex flex-row justify-between mb-10'>
				<p className=' text-xs'>
					Total (incl. £{bookingFee}/€{bookingFee} booking fee per ticket)
				</p>
				<p className='text-2xl font-bold'>£{yourTotal}</p>
			</div>
			<div className='flex justify-center'>
				<button
					className={
						`font-oswald text-4xl text-white w-full px-2 py-3 tracking-widest  rounded-md` +
						(enableSubmit
							? " bg-gradient-to-r  from-red-600 via-orange-500 to-orange-300"
							: " bg-gray-300")
					}
					disabled={!enableSubmit}
					onClick={() => {
						setOpenBookingModal(true)
					}}
				>
					DONE
				</button>
			</div>
		</div>
	)
}

export default YourSeats
