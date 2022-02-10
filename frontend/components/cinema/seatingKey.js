const SeatingKey = () => {
	return (
		<div className='pb-10'>
			<h2 className='mb-4 font-semibold'>Seating Key</h2>
			<div className='grid grid-flow-row grid-cols-2 gap-4'>
				<div className=''>
					<img src='/seats/Your Seat.svg' className='h-5 inline-block mr-2' />
					<p className=' inline-block'>Your seat</p>
				</div>
				<div className=''>
					<img src='/seats/VIPSeat.svg' className='h-5 inline-block mr-2' />
					<p className=' inline-block'>VIP seat</p>
				</div>
				<div className=''>
					<img
						src='/seats/OccupiedSeat.svg'
						className='h-5 inline-block mr-2'
					/>
					<p className=' inline-block'>Occupied seat</p>
				</div>
				<div className=''>
					<img src='/seats/TheRecliner.svg' className='h-5 inline-block mr-2' />
					<p className=' inline-block'>The Recliner</p>
				</div>
				<div className=''>
					<img
						src='/seats/standardSeat.svg'
						className='h-5 inline-block mr-2'
					/>
					<p className=' inline-block'>Standard seat</p>
				</div>
				<div className=''>
					<img
						src='/seats/WheelchairSpace.svg'
						className='h-5 inline-block mr-2'
					/>
					<p className=' inline-block'>Wheelchair space</p>
				</div>
				<div className=''>
					<img
						src='/seats/NotBookableSeat.svg'
						className='h-5 inline-block mr-2'
					/>
					<p className=' inline-block'>Not Bookable seat</p>
				</div>
			</div>
		</div>
	)
}

export default SeatingKey
