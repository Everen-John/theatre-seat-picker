import SeatGrid from "./seatGrid"
import SeatingKey from "./seatingKey"

const Cinema = ({ cinemaData, clickASeatHandler }) => {
	return (
		<>
			<div className='flex justify-center my-10 bg-gradient-to-br from-slate-200 to-slate-300 p-2 shadow-lg'>
				<SeatGrid
					seatGrid={cinemaData.seatGrid}
					clickASeatHandler={clickASeatHandler}
				/>
			</div>

			<SeatingKey />
		</>
	)
}

export default Cinema
