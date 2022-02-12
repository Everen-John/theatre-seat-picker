package com.example.movieTheatre;

public class Cinema {
    private SeatGrid seatGrid;

    private String movieName;

    private double bookingFee;

    public String getMovieName() {
        return movieName;
    }

    public SeatGrid getSeatGrid() {
        return seatGrid;
    }

    public double getBookingFee() {
        return bookingFee;
    }

    public Cinema(int numOfSeatsHorizontal, int numOfSeatsVertical, String movieName, double bookingFee) {
        this.movieName = movieName;
        this.seatGrid = new SeatGrid(numOfSeatsHorizontal, numOfSeatsVertical);
        this.bookingFee = bookingFee;
    }

}
