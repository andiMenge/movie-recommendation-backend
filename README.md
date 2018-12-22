# Movie Recommendations

## Architecture

### Backend

node.js backend with mongodb
POST and GET movies route

``` json
{
  "movies": [
    {
      "original_name": "",
      "imdb-id": "",
      "note": "",
      "release_date": "",
      "recommended_date": "",
      "is_highlight": ""
    }
  ]
}
```

### Frontend

parses all infos from TMDB based on imdb-id

[TMDB](https://github.com/cavestri/themoviedb-javascript-library/wiki)

[tmpl](https://startbootstrap.com/template-overviews/thumbnail-gallery/)

press thumbnail to copy imdb link to clipboard

RSS Feeds

IFTTT to create new movies