package org.ce.sports.Api.entities.repositories;



import org.ce.sports.Api.entities.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {

}
