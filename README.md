# Transformeur de contenu riche

## Installation

```shell
pnpm i
```

## Customization

Execute the following command :

```shell
cp .env.template .env
```

Then modify `.env` file to suit your needs.

## Build

```shell
pnpm run build
```

## Local run

```shell
pnpm run dev
```

## Call samples

To transform an HTML to JSON:

```shell
curl -L -X POST 'http://localhost:3000/transform' -H 'Content-Type: application/json' -d '{
    "requestedFormats": ["json"],
    "contentVersion": 0,
    "htmlContent": "<span>Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page<br><h1>Hello world</h1><br><a href=\"https://www.website.com\">Website</a>"
}'
```

To transform an HTML to PLAIN TEXT:

```shell
curl -L -X POST 'http://localhost:3000/transform' -H 'Content-Type: application/json' -d '{
    "requestedFormats": ["plainText"],
    "contentVersion": 0,
    "htmlContent": "<span>Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page<br><h1>Hello world</h1><br><a href=\"https://www.website.com\">Website</a>"
}'
```

To clean an HTML:

```shell
curl -L -X POST 'http://localhost:3000/transform' -H 'Content-Type: application/json' -d '{
    "requestedFormats": ["html"],
    "contentVersion": 0,
    "htmlContent": "<span>Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page<br><h1>Hello world</h1><br><a href=\"https://www.website.com\">Website"
}'
```

To transform a JSON to HTML and PLAIN TEXT:

```shell
curl -L -X POST 'http://localhost:3000/transform' -H 'Content-Type: application/json' -d '{
    "requestedFormats": [
        "html",
        "plainText"
    ],
    "contentVersion": 0,
    "jsonContent": {
        "type": "doc",
        "content": [
            {
                "type": "paragraph",
                "attrs": {
                    "textAlign": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page"
                    }
                ]
            }
        ]
    }
}'
```

To access metrics:

```shell
curl -L -X GET 'http://localhost:3000/metrics'
```