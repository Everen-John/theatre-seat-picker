import SeatCell from "./seatCell"
import Seat from "./seat"

const SeatGrid = ({ seatGrid, clickASeatHandler }) => {
	function nextChar(c) {
		return String.fromCharCode(c.charCodeAt(0) + 1)
	}

	const getSeatsNumbers = () => {
		let numbers = []
		for (let i = 0; i < seatGrid.numOfSeatsHorizontal; i++) {
			numbers.push(<h3>{i + 1}</h3>)
		}
		return numbers
	}

	let char = "@"
	let gridColsValue = seatGrid.numOfSeatsHorizontal + 1
	return (
		<div
			className='overflow-x-auto'
			style={{
				display: "grid",
				gap: "0.4rem",
				gridTemplateColumns: "repeat(" + gridColsValue + ", 1fr)",
			}}
		>
			<div
				className=' flex justify-center'
				style={{
					gridColumn: "2 /" + (gridColsValue + 1),
				}}
			>
				<img src='/seats/Screen.svg' className=' h-60' data-tip='screen' />
			</div>
			{seatGrid.seatCells.map((seatCellItems, index) => {
				{
					char = nextChar(char)
				}
				return (
					<>
						<h1 className='' key={char}>
							{char}
						</h1>
						{seatCellItems.map((seatCellItem, index) => (
							<div
								key={seatCellItem.col + seatCellItem.seatLetter}
								className='w-12'
								onClick={(e) => clickASeatHandler(e, seatCellItem)}
							>
								<Seat
									seat={seatCellItem.seat}
									clickASeatHandler={clickASeatHandler}
								/>
							</div>
						))}
					</>
				)
			})}
			<h1>{/**Keep this h1 empty for a grid space */}</h1>
			{getSeatsNumbers()}
		</div>
	)
}

export default SeatGrid
