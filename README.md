# React + Aleo + Leo

### Start in development mode

```bash
npm run dev
```

Your app should be running on http://localhost:5173/

### Mocks and Errors

1. The round_id value is fixed to 1u32 for test purposes.

2. Currently, requests to the Pastebin service result in CORS errors. Using a proxy service to bypass this results in blocking the remaining requests except for the first one. So, only one of the contents is able to be fetched. Due to these problems with Pastebin, it can be easily fixed by changing the text provider service.


### Build Leo program

1. Copy the `helloworld/.env.example` to `helloworld/.env` (this will be ignored
   by Git):

   ```bash
   cd helloworld
   cp .env.example .env
   ```

2. Replace `PRIVATE_KEY=user1PrivateKey` in the `.env` with your own key (you
   can use an existing one or generate your own at https://aleo.tools/account)

3. Follow instructions to install Leo here: https://github.com/AleoHQ/leo

4. You can edit `helloworld/src/main.leo` and run `leo run` to compile and update the
   Aleo instructions under `build` which are loaded by the web app.

## Deploy program from web app

# aleo-crowdfunding
