all:

db:
	@docker run -d -p 27017:27017 mongo

request:
	@http 127.0.0.1:3000/movies url=https://www.imdb.com/title/tt2274648/ && http 127.0.0.1:3000/movies