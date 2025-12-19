package com.sermo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SermoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SermoApplication.class, args);
    }
}

