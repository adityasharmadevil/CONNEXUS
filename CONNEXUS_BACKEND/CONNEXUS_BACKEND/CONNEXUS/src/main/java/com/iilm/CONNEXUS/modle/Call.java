package com.iilm.CONNEXUS.modle;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Document(collection = "calls")
public class Call {

    @Id
    private String id;

    private String callerId;
    private String receiverId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date startedAt;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date endedAt;

    private String status;
}