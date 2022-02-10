
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

@SpringBootApplication
@RestController
public class MovieTheatreApplication {
	public static Hashtable<String, Cinema> cinemaDict;
	public static double bookingFee;

	public static void main(String[] args) {
		SpringApplication.run(MovieTheatreApplication.class, args);
		cinemaDict = new Hashtable<String, Cinema>();// Placeholder Database for prototyper
		cinemaDict.put("Cinema1", new Cinema(12, 12, "The Matrix", 0.79));
		bookingFee = 0.79;

	}

	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Hello %s!", name);
	}

	@CrossOrigin
	@GetMapping("/cinema")
	public Cinema index(@RequestParam(value = "name", defaultValue = "World") String name) {

		Cinema cinema = cinemaDict.get("Cinema1");
		return cinema;
	}

	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	@PostMapping("/seatGrid/seatCell/CalculatePrice")
	public double getSeatsPrice(@RequestBody SeatCell[] seatCellsInput) {
		System.out.println("Yep");
		double totalPrice = 0;
		System.out.println("Hi!");
		Cinema cinema = cinemaDict.get("Cinema1");
		for (SeatCell seatCellInput : seatCellsInput) {
			totalPrice += cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
					.getPriceInPounds() + cinema.getBookingFee();
		}
		return Math.round(totalPrice * 100.0) / 100.0;

	}

	@CrossOrigin
	@ResponseStatus(HttpStatus.OK)
	@PostMapping("/seatGrid/seatCell")
	public boolean updateSeatCellData(@RequestBody SeatCell seatCellInput,
			@RequestParam(value = "statusChange", defaultValue = "none") String statusChange) {
		System.out.println("Changing status to " + statusChange);
		Cinema cinema = cinemaDict.get("Cinema1");
		switch (statusChange) {
			case "TEMPORARILYOCCUPY":
				SeatCell seatCellExtract = cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput
						.getCol()];
				if (seatCellExtract.getSeat().getStatus() == Seat.Status.AVAILABLE) {
					seatCellExtract.getSeat().setStatus(Seat.Status.ISBEINGOCCUPIED);
					return true;
				} else {
					return false;
				}

			case "DEOCCUPY":
				if (cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
						.getStatus() == Seat.Status.ISBEINGOCCUPIED) {
					cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
							.setStatus(Seat.Status.AVAILABLE);
					return true;
				} else {
					return false;
				}

			case "CONFIRMOCCUPY":
				if (cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
						.getStatus() == Seat.Status.ISBEINGOCCUPIED) {
					cinema.getSeatGrid().getSeatCells()[seatCellInput.getRow()][seatCellInput.getCol()].getSeat()
							.setStatus(Seat.Status.OCCUPIED);
					return true;
				} else {
					return false;
				}
			case "none":
			default:
				return false;
		}

	}

}
