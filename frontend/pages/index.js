import Head from "next/head"
import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import Container from "@/components/layout/container"
import Cinema from "@/components/cinema/cinema"
import Tooltip from "react-tooltip"
import Master from "@/components/layout/master"
import YourSeats from "@/components/yourSeats/yourSeats"

export default function Home() {
	let [cinemaData, setCinemaData] = useState()
	let [isLoading, setIsLoading] = useState(true)
	let [yourSeats, setYourSeats] = useState([])
	let [yourTotal, setYourTotal] = useState(0)
	let [enableSubmit, setEnableSubmit] = useState(false)

	const loadPage = async () => {
		return new Promise(async (resolve, reject) => {
			let res = await loadCinemaData()
			console.log(res)
			resolve(res)
		}).then((res) => {
			setCinemaData(res)
			setIsLoading(false)
		})
	}

	const addYourSeatIntoCinemaData = ({ seat: seatCell }) => {
		let newCinemaData = { ...cinemaData }
		let newSeatCell = { ...seatCell }
		newSeatCell.seat.status = "YOURSEAT"
		newCinemaData.seatGrid.seatCells[seatCell.row][seatCell.col] = newSeatCell
		setCinemaData(newCinemaData)
		setYourSeats([...yourSeats, newSeatCell])
	}
	const loadCinemaData = async () => {
		let res = await fetch("/api/cinema/getCinemaData", {
			method: "GET", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url), // body data type must match "Content-Type" header
		}).then((res) => res.json())
		return res
	}

	const checkSeatAvailability = async (seat) => {
		let res = await fetch("/api/seat/checkSeat", {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url), // body data type must match "Content-Type" header
			body: JSON.stringify({
				...seat,
			}),
		}).then((res) => res.json())

		return res
	}

	const calculatePrice = async () => {
		let res = await fetch("/api/seat/getSeatsPrice", {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url), // body data type must match "Content-Type" header
			body: JSON.stringify([...yourSeats]),
		}).then((res) => res.json())

		return res
	}

	const clickASeat = async (e, seat) => {
		console.log("clicked ", seat)

		if (seat.seat.status === "YOURSEAT") {
			removeYourSeat(null, seat)
			return
		}

		switch (seat.seat.status) {
			case "ISBEINGOCCUPIED":
				window.alert(`${seat.col}${seat.seatLetter} is being occupied!`)
			case "OCCUPIED":
			case "NOTBOOKABLE":
				window.alert(`${seat.col}${seat.seatLetter} has been taken!`)
				break
			case "AVAILABLE":
				let res = await updateSeatOnServer(seat, "TEMPORARILYOCCUPY")
				if (!res) {
					window.alert(`${seat.col}${seat.seatLetter} is being occupied!`)
				} else {
					addYourSeatIntoCinemaData({ seat })
				}

				console.log(res)
		}
	}

	const updateSeatOnServer = async (seat, statusChange) => {
		let res = await fetch("/api/seat/updateSeat", {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url), // body data type must match "Content-Type" header
			body: JSON.stringify({ seat, statusChange }),
		}).then((res) => res.json())

		return res
	}

	const removeYourSeat = (e, seat) => {
		//TODO
		console.log(seat)
		//Remove seat from YourSeats
		let yourSeatsNew = [...yourSeats]
		yourSeatsNew.splice(yourSeats.indexOf(seat), 1)
		setYourSeats(yourSeatsNew)
		//Make seat type AVAILABLE in cinemaData
		let cinemaDataNew = { ...cinemaData }
		cinemaDataNew.seatGrid.seatCells[seat.row][seat.col].seat.status =
			"AVAILABLE"
		setCinemaData(cinemaDataNew)
		//De-In-Occupy seat on server
		updateSeatOnServer(seat, "DEOCCUPY")
	}

	useEffect(() => {
		loadPage()
	}, [])

	useEffect(() => {
		if (!isLoading) {
		}
	}, [isLoading])

	useEffect(() => {
		if (yourSeats.length > 0) {
			calculatePrice().then((res) => {
				setYourTotal(res)
			})
			setEnableSubmit(true)
		} else {
			setYourTotal(0)
			setEnableSubmit(false)
		}
	}, [yourSeats])

	return (
		<div>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='Generated by create next app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<main>
					<Master>
						<Header movieName={cinemaData.movieName} />

						<Tooltip />
						<div className='lg:grid lg:grid-flow-col lg:grid-cols-2'>
							<section>
								<Container>
									<Cinema
										cinemaData={cinemaData}
										clickASeatHandler={clickASeat}
										removeYourSeat={removeYourSeat}
									/>
								</Container>
							</section>
							<section className='m-10'>
								<Container>
									<YourSeats
										yourSeats={yourSeats}
										removeYourSeat={removeYourSeat}
										bookingFee={cinemaData.bookingFee}
										yourTotal={yourTotal}
										enableSubmit={enableSubmit}
									/>
								</Container>
							</section>
						</div>
					</Master>
				</main>
			)}

			<footer></footer>
		</div>
	)
}
