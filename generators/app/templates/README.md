# <%= name %>

## Run NLP

```bash
docker-compose up
```

Admin Interface : http://localhost:80

## Init NLP (using FirstInit.kt)

- FirstInit.kt will :
  - Init Bot App
  - Pre Train Bot 

## Init NLP (if not using FirstInit.kt)

- Create new application
- Add name
- Allow subentities if you need complex entity model like voyage : depart, arrivée, ..
- Add fr locale
- Use stanford NLP (better results)

## NLP

- You should deploy your NLP for training, or train on local and then export your model
- You will find pre trained exports sentences inf folder pre trained data. You can import this sentences in your bot to gain some time

## Client

- Use mvn install to install bot client dependencies

## Mongo Conversiational (optional)

docker run -p 27017:27017 --name mongo-bot -d mongo
