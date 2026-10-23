package com.rarelife;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BloodApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  RareLife Spring Boot Backend Service Started   ");
        System.out.println("  REST Endpoints Available on: http://localhost:8080/api ");
        System.out.println("=================================================");
    }
}
