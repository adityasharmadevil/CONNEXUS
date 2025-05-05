package com.iilm.CONNEXUS.repository;

import com.iilm.CONNEXUS.modle.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionEntryRepo extends MongoRepository<User,String> {
}
