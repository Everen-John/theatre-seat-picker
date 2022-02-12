package com.example.movieTheatre;

public class Person {
    private String fullName;
    private String email;

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Person(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }
}
