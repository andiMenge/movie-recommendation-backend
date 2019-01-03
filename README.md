# Movie Recommendations

## ToDo

- correct timestamp for created_date in DB

## Snippets

Bulk Import
`cat movies.txt |while IFS= read -r line; do; http --ignore-stdin https://movies.andimenge.de/api/movies key==${AUTH_KEY} url=${line}; sleep 1; done`

## Architecture

### Frontend

press thumbnail to copy imdb link to clipboard

RSS Feeds

IFTTT to create new movies