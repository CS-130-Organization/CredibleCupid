all:
	docker-compose stop && docker-compose up --build --remove-orphans

clean:
	docker-compose down -v
