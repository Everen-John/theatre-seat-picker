package com.example.movieTheatre;

import java.lang.Math;

public class SeatGrid {
    private int numOfSeatsTotal;
    private int numOfSeatsHorizontal;
    private int numOfSeatsVertical;
    private SeatCell[][] seatCells;

    public int getNumOfSeatsTotal() {
        return numOfSeatsTotal;
    }

    public int getNumOfSeatsHorizontal() {
        return numOfSeatsHorizontal;
    }

    public int getNumOfSeatsVertical() {
        return numOfSeatsVertical;
    }

    public SeatCell[][] getSeatCells() {
        return seatCells;
    }

    public SeatGrid(int numOfSeatsHorizontal, int numOfSeatsVertical) {
        this.numOfSeatsHorizontal = numOfSeatsHorizontal;
        this.numOfSeatsVertical = numOfSeatsVertical;
        this.numOfSeatsTotal = numOfSeatsHorizontal * numOfSeatsVertical;
        char letter = 'A';

        this.seatCells = new SeatCell[numOfSeatsHorizontal][numOfSeatsHorizontal];
        for (int i = 0; i < numOfSeatsVertical; i++) {
            for (int j = 0; j < numOfSeatsHorizontal; j++) {
                int number = (int) (Math.random() * 10) % 21;
                switch (number) {
                    case 0: // CASE FOR OCCUPIED/ISBEINGOCCUPIED
                    case 16:
                    case 17:
                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.OCCUPIED, Seat.Type.STANDARD, 5.00));
                        break;
                    case 1:
                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.ISBEINGOCCUPIED, Seat.Type.STANDARD, 5.00));
                        break;
                    case 2:
                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.NOTBOOKABLE, Seat.Type.STANDARD, 5.00));
                        break;
                    case 3:
                    case 7:
                    case 8:
                    case 9:
                    case 13:
                    case 14:
                    case 15:
                    case 18:
                    case 19:
                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.AVAILABLE, Seat.Type.STANDARD, 5.00));
                        break;
                    case 4:
                    case 10:
                    case 11:
                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.AVAILABLE, Seat.Type.VIP, 10.00));
                        break;
                    case 5:
                    case 12:
                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.AVAILABLE, Seat.Type.RECLINER, 7.00));
                        break;
                    case 6:
                    case 20:

                        this.seatCells[i][j] = new SeatCell(i, j, letter, true,
                                new Seat(Seat.Status.AVAILABLE, Seat.Type.WHEELCHAIRSPACE, 5.00));
                        break;

                }

            }
            letter += 1;
        }

    }
}
