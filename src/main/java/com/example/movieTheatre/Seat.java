package com.example.movieTheatre;

public class Seat {
    public enum Status {
        ISBEINGOCCUPIED,
        OCCUPIED,
        AVAILABLE,
        NOTBOOKABLE,
        YOURSEAT
    }

    public enum Type {
        STANDARD,
        VIP,
        RECLINER,
        WHEELCHAIRSPACE,
    }

    private Status status;
    private Type type;
    private String satBy;
    private double priceInPounds;

    public void setType(Type type) {
        this.type = type;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setSatBy(String satBy) {
        this.satBy = satBy;
    }

    public String getSatBy(String policy) {
        return satBy;
    }

    public Status getStatus() {
        return this.status;
    }

    public Type getType() {
        return this.type;
    }

    public double getPriceInPounds() {
        return this.priceInPounds;
    }

    public Seat(Status status, Type type, double priceInPounds) {
        this.status = status;
        this.type = type;
        this.priceInPounds = priceInPounds;
    }

}
