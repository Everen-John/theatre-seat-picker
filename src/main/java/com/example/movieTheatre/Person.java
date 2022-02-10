package com.example.movieTheatre;

public class Person {
    private String firstName;
    private String email;

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }

    public Person(String firstName, String email) {
        this.firstName = firstName;
        this.email = email;
    }
}
