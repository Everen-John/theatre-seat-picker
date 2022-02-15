import Head from "next/head"
import { useState, useEffect, useRef } from "react"
import { object, string, number, date, InferType } from "yup"
import Tooltip from "react-tooltip"
import { Router, useRouter } from "next/router"

import Header from "@/components/layout/header"
import Container from "@/components/layout/container"
import Cinema from "@/components/cinema/cinema"
import Master from "@/components/layout/master"
import YourSeats from "@/components/yourSeats/yourSeats"
import EmailModal from "@/components/cinema/emailModal"

//YUP Validation for email and password schema to be used during validation
let yourDataSchema = object({
	fullName: string()
		.matches(/^[a-zA-Z ]+$/)
		.required(),
	email: string().email().required(),
})

export default function Home() {
	//cinemaData- all of Cinema data
	const [cinemaData, setCinemaData] = useState()
	//Loading flag to inform a loading state: always true first
	const [isLoading, setIsLoading] = useState(true)
	//yourSeats- Seats chosen by user
	const [yourSeats, setYourSeats] = useState([])
	//yourTotal- Total price data retrieved serverside: Always starts at 0 first
	const [yourTotal, setYourTotal] = useState(0)
	//Enable [DONE] button before confirmation modal: Always false until user picks
	const [enableSubmit, setEnableSubmit] = useState(false)
	//Enable [SUBMIT] button when user fills in details correctly: Always false until validation is done
	const [enable2ndSubmit, setEnable2ndSubmit] = useState(false)
	//openBookingModal- Flag to open confirmation modal: Always false until user clicks done
	const [openBookingModal, setOpenBookingModal] = useState(false)
	//yourData- User's data
	const [yourData, setYourData] = useState({
		fullName: "",
		email: "",
	})
	//modalCancelButtonRef- Button to close confirmation modal
	const modalCancelButtonRef = useRef(null)

	const router = useRouter()

	//API to fetch cinemaData from RestAPI
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

	//API to Fetch total price from RestAPI based on array of user picked seats
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

	//API to Update a Seat on server either to TEMPORARILYOCCUPY or DEOCCUPY
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

	//API to Updates the Seats on server from TEMPORARILYOCCUPY to OCCUPY
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

	//Adds YOURSEAT data enum into the seat status
	const addYourSeatIntoCinemaData = ({ seat: seatCell }) => {
		let newCinemaData = { ...cinemaData }
		let newSeatCell = { ...seatCell }
		newSeatCell.seat.status = "YOURSEAT"
		newCinemaData.seatGrid.seatCells[seatCell.row][seatCell.col] = newSeatCell
		setCinemaData(newCinemaData)
		setYourSeats([...yourSeats, newSeatCell])
	}

	//function to handle user clicking a seat
	const clickASeat = async (e, seat) => {
		console.log("clicked ", seat)

		//If yourSeats selected is already more than 10
		if (yourSeats.length > 9 && seat.seat.status === "AVAILABLE") {
			alert("You can only select 10 seats at a time!")
			return
		}

		//If seat is your seat, then remove the seat from yourSeats array
		if (seat.seat.status === "YOURSEAT") {
			removeYourSeat(null, seat)
			return
		}

		//If seat is not your seat,
		switch (seat.seat.status) {
			//If seat is in progress of being occupied, alert user that it is being occupied
			case "ISBEINGOCCUPIED":
				window.alert(`${seat.col + 1}${seat.seatLetter} is being occupied!`)
				break
			//If seat is Occupied or not bookable, then alert user that it is not bookable
			case "OCCUPIED":
			case "NOTBOOKABLE":
				window.alert(`${seat.col + 1}${seat.seatLetter} has been taken!`)
				break
			//If seats are available
			case "AVAILABLE":
				//Try to confirm temporary occupation of that seat on the server
				let res = await updateSeatOnServer(seat, "TEMPORARILYOCCUPY")
				//res returns a boolean: true if the seat is available on server, or false if the seat is temporarily occupied or occupied on server
				if (!res) {
					//If seat is occupied on server, alert user that it is occupied
					window.alert(`${seat.col + 1}${seat.seatLetter} is being occupied!`)
				} else {
					//If seat is available on server, add seat to yourSeats array
					addYourSeatIntoCinemaData({ seat })
				}

				console.log(res)
		}
	}

	//Function to submit seats
	const submitSeats = async () => {
		let res = await updateCinemaOnServer(yourSeats, "PERMANENTLYOCCUPY")
		//res returns a boolean, if true, then the seats are successfully updated on server. If false, then the seats are not updated on server, or seats are occupied
		if (res) {
			window.alert("Successfully Booked!")
			router.reload()
		} else {
			window.alert("Failed to Book!")
			router.reload
		}
	}

	//Function to set yourData state
	const yourDataChangeHandler = (e) => {
		setYourData({ ...yourData, [e.target.name]: e.target.value })
	}

	//Function to remove yourSeat from state and from server
	const removeYourSeat = (e, seat) => {
		let yourSeatsNew = [...yourSeats]
		//remove seat
		yourSeatsNew.splice(yourSeats.indexOf(seat), 1)
		//set yourSeats state
		setYourSeats(yourSeatsNew)
		//Make seat type AVAILABLE in cinemaData clientSide first
		let cinemaDataNew = { ...cinemaData }
		cinemaDataNew.seatGrid.seatCells[seat.row][seat.col].seat.status =
			"AVAILABLE"
		setCinemaData(cinemaDataNew)
		//De-Occupy seat on server
		updateSeatOnServer(seat, "DEOCCUPY")
	}

	//On page start, load the page with the cinema data
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

	//On every seat selection, calculate seat price on server, and then set yourTotal value
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

	//On the change of yourData, perform validation. If the data is valid, enable the submit button
	//If the data is invalid, disable the submit button
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
				<title>Theatre Seat App</title>
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
