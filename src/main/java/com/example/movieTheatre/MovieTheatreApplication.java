
package com.example.movieTheatre;

import java.util.Hashtable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
@RestController
public class MovieTheatreApplication {
	public static Hashtable<String, Cinema> cinemaDict;
	public static double bookingFee;

	@Autowired
	private JavaMailSender javaMailSender;

	// Function to send email to user who has booked tickets in the cinema
	void sendEmail(SubmissionInput submissionInput) {
		String seatCellsString = "Your Seats are:\n ";
		for (int i = 0; i < submissionInput.seatCellsInput.length; i++) {

			seatCellsString += Character.toString(submissionInput.seatCellsInput[i].getSeatLetter()) +
					+(submissionInput.seatCellsInput[i].getCol() + 1) + ": "
					+ submissionInput.seatCellsInput[i].getSeat().getType()
					+ "\n ";
			System.out.println(seatCellsString);
		}
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setTo(submissionInput.personInput.getEmail());
		msg.setSubject("Hi " + submissionInput.personInput.getFullName() + ", you've successfully booked your seats!");
		msg.setText(
				" Hi " + submissionInput.personInput.getFullName() + ", you've successfully booked your seats!\n"
						+ seatCellsString + "\n"
						+ "Thank you for booking with us!");

		javaMailSender.send(msg);

	}

	// main function to start the server
	public static void main(String[] args) {
		SpringApplication.run(MovieTheatreApplication.class, args);
		cinemaDict = new Hashtable<String, Cinema>();// Placeholder Database for prototype
		// Create new cinema based on width, height, cinema name, and booking fee
		cinemaDict.put("Cinema1", new Cinema(20, 20, "The Matrix", 0.79));

	}

	// @GetMapping("/hello")
	// public String hello(@RequestParam(value = "name", defaultValue = "World")
	// String name) {
	// return String.format("Hello %s!", name);
	// }

	// GET cinema: cinema data from hashtable cinemaDict
	@CrossOrigin
	@GetMapping("/cinema")
	public Cinema index(@RequestParam(value = "name", defaultValue = "World") String name) {

		Cinema cinema = cinemaDict.get("Cinema1");
		return cinema;
	}

	// POST cinema: to update seats data with submissionInput and a statusChange
	// flag
	@CrossOrigin
	@PostMapping("/cinema")
	@ResponseStatus(HttpStatus.OK)
	public boolean updateCinema(@RequestBody SubmissionInput submissionInput,

			@RequestParam(value = "statusChange", defaultValue = "none") String statusChange
	// @RequestParam(value = "satByInput", defaultValue = "none") String satByInput,
	// @RequestBody Person personInput
	) {
		System.out.println(
				"Email Test");
		Cinema cinema = cinemaDict.get("Cinema1");
		if (!statusChange.isEmpty()) {
			switch (statusChange) {
				case "PERMANENTLYOCCUPY":
					for (SeatCell seatCell : submissionInput.seatCellsInput) {
						cinema.getSeatGrid().getSeatCells()[seatCell.getRow()][seatCell.getCol()].getSeat()
								.setStatus(Seat.Status.OCCUPIED);
						cinema.getSeatGrid().getSeatCells()[seatCell.getRow()][seatCell.getCol()].getSeat()
								.setSatBy(submissionInput.personInput);
					}
					sendEmail(submissionInput);

					return true;
				default:
					return false;
			}
		} else {
			return false;
		}

	}

	// POST- getSeatsPrice: calculate the price of the user's seats based on seat
	// data from the server.
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	@PostMapping("/seatGrid/seatCell/CalculatePrice")
	public double getSeatsPrice(@RequestBody SeatCell[] seatCellsInput) {
		double totalPrice = 0;
		Cinema cinema = cinemaDict.get("Cinema1");
		for (SeatCell seatCellInput : seatCellsInput) {
			totalPrice += cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
					.getPriceInPounds() + cinema.getBookingFee();
		}
		return Math.round(totalPrice * 100.0) / 100.0;

	}

	// POST- updateCellCellData: updates a single seat in the cinema based on the
	// seatCellInput provided and the statusChange flag provided
	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	@PostMapping("/seatGrid/seatCell")
	public boolean updateSeatCellData(@RequestBody SeatCell seatCellInput,
			@RequestParam(value = "statusChange", defaultValue = "none") String statusChange) {
		System.out.println("Changing status to " + statusChange);
		Cinema cinema = cinemaDict.get("Cinema1");
		switch (statusChange) {
			// If statusChange is to TEMPORARILYOCCUPY, then if the seat is available, then
			// temporarily occupy it. Else, fail the request.
			case "TEMPORARILYOCCUPY":
				SeatCell seatCellExtract = cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput
						.getCol()];
				if (seatCellExtract.getSeat().getStatus() == Seat.Status.AVAILABLE) {
					seatCellExtract.getSeat().setStatus(Seat.Status.ISBEINGOCCUPIED);
					return true;
				} else {
					return false;
				}

				// If statusChange is to DEOCCUPY, then if the seat is being occupied, then make
				// the Seat Available, else, fail the request.
			case "DEOCCUPY":
				if (cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
						.getStatus() == Seat.Status.ISBEINGOCCUPIED) {
					cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
							.setStatus(Seat.Status.AVAILABLE);
					return true;
				} else {
					return false;
				}

				// If statusChange is to CONFIRMOCCUPY, then if the seat is being occupied, then
				// make the Seat Occupied, else, fail the request.
			case "CONFIRMOCCUPY":
				if (cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
						.getStatus() == Seat.Status.ISBEINGOCCUPIED) {
					cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
							.setStatus(Seat.Status.OCCUPIED);
					return true;
				} else {
					return false;
				}
				// Case none is provided, fail the request. This should not happen unless there
				// is a bug in the code.
			case "none":
			default:
				return false;
		}

	}

}
