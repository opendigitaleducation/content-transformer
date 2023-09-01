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

To transform an HTML to JSON :

```shell
curl -X POST -H "Content-Type: application/json" -d '{"action": "html2json", "document":"<span>Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en pag"}' http://localhost:8000/transform
```

To transform a JSON to HTML :

```shell
curl -X POST -H "Content-Type: application/json" -d '{"action": "json2html", "json":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en pag"}]}]}}' http://localhost:8000/transform
```