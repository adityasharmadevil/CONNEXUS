package com.iilm.CONNEXUS.modle;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Document(collection = "sessions")
public class Session {

    @Id
    private String id;

    private String userId;
    private String socketId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date lastSeen;
}