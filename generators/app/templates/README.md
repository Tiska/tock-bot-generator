# <%= name %>

## Run NLP

```bash
docker-compose up
```

Admin Interface : http://localhost:80

## Init NLP

- Create new application
- Add name
- Allow subentities if you need complex entity model like voyage : depart, arrivée, ..
- Add fr locale
- Use stanford NLP (better results)

## NLP

- You should deploy your NLP for training, or train on local and then export your model
- You will find pre trained exports sentences inf folder pre trained data. You can import this sentences in your bot to gain some time
