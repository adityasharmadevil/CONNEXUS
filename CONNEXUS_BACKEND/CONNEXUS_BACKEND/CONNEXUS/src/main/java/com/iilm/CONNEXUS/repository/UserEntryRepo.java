package com.iilm.CONNEXUS.repository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.iilm.CONNEXUS.modle.User;

import java.util.Optional;


public interface UserEntryRepo extends MongoRepository<User, String>{
    Optional<User> findByUsername(String username);
     void deleteByUsername(String username);

}
