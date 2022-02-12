package com.example.movieTheatre;

import com.example.movieTheatre.Seat.Status;

public class SeatCell {
    private int row;
    private int col;
    private char seatLetter;
    private boolean hasSeat;
    private Seat seat;

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    public char getSeatLetter() {
        return seatLetter;
    }

    public boolean hasSeat() {
        return hasSeat;
    }

    public Seat getSeat() {
        return seat;
    }

    public SeatCell(int row, int col, char seatLetter, boolean hasSeat, Seat seat) {
        this.row = row;
        this.col = col;
        this.seatLetter = seatLetter;
        this.hasSeat = hasSeat;
        this.seat = seat;
    }

}
