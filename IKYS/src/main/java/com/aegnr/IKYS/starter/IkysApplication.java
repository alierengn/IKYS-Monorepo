package com.aegnr.IKYS.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.aegnr.IKYS"}) //entityleri görmeyi sağlar database için
@ComponentScan(basePackages = {"com.aegnr.IKYS"})//restcontroller servis repository gibi anatasyonların konteynırda beanleri oluşması için yazılır. 
@EnableJpaRepositories(basePackages = {"com.aegnr.IKYS"}) //jpa repositorylerini projede aktif hale getirmek için yazılır
public class IkysApplication {

	public static void main(String[] args) {
		SpringApplication.run(IkysApplication.class, args);
	}

}
