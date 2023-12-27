package com.todo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.SuperUser;

public interface SuperUserRepository extends JpaRepository<SuperUser, Long> {
//    SuperUser findByUsername(String username);
}
