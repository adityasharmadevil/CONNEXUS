package com.iilm.CONNEXUS.modle;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
@Data
@Document(collection = "users")
public class User {
    @Id
    private String id; //remove

    private String username;  // 7-char unique pass by frontend
    private String email;
    private String phone;
    private String password;
    private String name;
    private String status;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdAt;

}
