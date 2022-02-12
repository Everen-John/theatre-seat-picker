import Head from "next/head"
import { useState, useEffect, useRef } from "react"
import { object, string, number, date, InferType } from "yup"

import Header from "@/components/layout/header"
import Container from "@/components/layout/container"
import Cinema from "@/components/cinema/cinema"
import Tooltip from "react-tooltip"
import Master from "@/components/layout/master"
import YourSeats from "@/components/yourSeats/yourSeats"
import EmailModal from "@/components/cinema/emailModal"
import { Router, useRouter } from "next/router"

let yourDataSchema = object({
	fullName: string()
		.matches(/^[a-zA-Z ]+$/)
		.required(),
	email: string().email().required(),
})
export default function Home() {
	const [cinemaData, setCinemaData] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const [yourSeats, setYourSeats] = useState([])
	const [yourTotal, setYourTotal] = useState(0)
	const [enableSubmit, setEnableSubmit] = useState(false)
	const [enable2ndSubmit, setEnable2ndSubmit] = useState(false)
	const [openBookingModal, setOpenBookingModal] = useState(false)
	const [yourData, setYourData] = useState({
		fullName: "",
		email: "",
	})
	const modalCancelButtonRef = useRef(null)

	const router = useRouter()

	// const loadPage = async () => {
	// 	return new Promise(async (resolve, reject) => {
	// 		let res = await loadCinemaData()
	// 		console.log(res)
	// 		resolve(res)
	// 	}).then((res) => {
	// 		setCinemaData(res)
	// 		setIsLoading(false)
	// 	})
	// }

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
				window.alert(`${seat.col + 1}${seat.seatLetter} is being occupied!`)
				break
			case "OCCUPIED":
			case "NOTBOOKABLE":
				window.alert(`${seat.col + 1}${seat.seatLetter} has been taken!`)
				break
			case "AVAILABLE":
				let res = await updateSeatOnServer(seat, "TEMPORARILYOCCUPY")
				if (!res) {
					window.alert(`${seat.col + 1}${seat.seatLetter} is being occupied!`)
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

	const updateCinemaOnServer = async (seats, statusChange) => {
		let res = await fetch("/api/cinema/updateCinema", {
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
			body: JSON.stringify({ seats, statusChange, yourData }),
		}).then((res) => res.json())

		return res
	}

	const submitSeats = async () => {
		let res = await updateCinemaOnServer(yourSeats, "PERMANENTLYOCCUPY")
		if (res) {
			window.alert("Successfully Booked!")
			router.reload()
		} else {
			window.alert("Failed to Book!")
			router.reload
		}
	}

	const yourDataChangeHandler = (e) => {
		console.log(e.target.name, e.target.value)
		setYourData({ ...yourData, [e.target.name]: e.target.value })
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

	useEffect(() => {
		console.log(yourData)
		console.log(yourDataSchema.isValidSync(yourData))
		if (yourData) {
			if (yourDataSchema.isValidSync(yourData)) {
				setEnable2ndSubmit(true)
			} else {
				setEnable2ndSubmit(false)
			}
		}
	}, [yourData])

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
										setOpenBookingModal={setOpenBookingModal}
									/>
								</Container>
							</section>
						</div>
						<EmailModal
							open={openBookingModal}
							setOpen={setOpenBookingModal}
							cancelButtonRef={modalCancelButtonRef}
							yourSeats={yourSeats}
							yourData={yourData}
							yourDataChangeHandler={yourDataChangeHandler}
							yourTotal={yourTotal}
							bookingFee={cinemaData.bookingFee}
							enable2ndSubmit={enable2ndSubmit}
							submitSeats={submitSeats}
						/>
					</Master>
				</main>
			)}

			<footer></footer>
		</div>
	)
}
