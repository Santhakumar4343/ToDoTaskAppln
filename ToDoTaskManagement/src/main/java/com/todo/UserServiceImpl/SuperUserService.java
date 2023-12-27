package com.todo.UserServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.SuperUserRepository;
import com.todo.entity.SuperUser;

@Service
public class SuperUserService {
    @Autowired
    private SuperUserRepository superUserRepository;

    public SuperUser saveSuperUser(SuperUser superUser) {
        // Additional logic if needed before saving
        return superUserRepository.save(superUser);
    }

    public SuperUser getSuperUserById(Long id) {
        return superUserRepository.findById(id).orElse(null);
    }

//    public SuperUser getSuperUserByUsername(String username) {
//        return superUserRepository.findByUsername(username);
//    }
    // Additional methods for managing super users
}

