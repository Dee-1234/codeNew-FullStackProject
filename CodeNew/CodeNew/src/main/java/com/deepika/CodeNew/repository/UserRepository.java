package com.deepika.CodeNew.repository;

import com.deepika.CodeNew.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    // List<User> findAllByRole(Role role);
}