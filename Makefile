name := movie-favs
dockerTag := $(shell git rev-parse head)

db:
	@docker run -d -p 27017:27017 mongo

request:
	@http -h 127.0.0.1:3000/movies url=https://www.imdb.com/title/tt2274648/ key==${AUTH_KEY} && http -h 127.0.0.1:3000/movies

docker:
	@docker build -t andimenge/$(name):$(dockerTag) .

push:
	@docker push andimenge/$(name):$(dockerTag)
