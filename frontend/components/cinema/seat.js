import Tooltip from "react-tooltip"

const Seat = ({ seat }) => {
	const checkStatus = () => {
		switch (seat.status) {
			case "ISBEINGOCCUPIED":
			case "OCCUPIED":
				return (
					<img
						className='h-10 w-auto'
						src='/seats/OccupiedSeat.svg'
						data-tip={`Occupied Seat`}
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
			case "NOTBOOKABLE":
				return (
					<img
						className='h-10 w-auto'
						src='/seats/NotBookableSeat.svg'
						data-tip='Not Bookable'
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
			case "YOURSEAT":
				return (
					<img
						className='h-10 w-auto cursor-pointer'
						src='/seats/Your Seat.svg'
						data-tip='Seat Selected'
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
			case "AVAILABLE":
			default:
				break
		}

		switch (seat.type) {
			case "STANDARD":
				return (
					<img
						className='h-10 w-auto cursor-pointer'
						src='/seats/standardSeat.svg'
						data-tip='Available Standard Seat'
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
			case "VIP":
				return (
					<img
						className='h-10 w-auto cursor-pointer'
						src='/seats/VIPSeat.svg'
						data-tip='Available VIP Seat'
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
			case "RECLINER":
				return (
					<img
						className='h-10 w-auto cursor-pointer'
						src='/seats/TheRecliner.svg'
						data-tip='Available Recliner Seat'
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
			case "WHEELCHAIRSPACE":
				return (
					<img
						className='h-10 w-auto cursor-pointer'
						src='/seats/WheelchairSpace.svg'
						data-tip='Available Wheelchair seat'
						// onClick={(e) => clickASeatHandler(e, seat)}
					/>
				)
		}
	}

	return checkStatus()
}

export default Seat
