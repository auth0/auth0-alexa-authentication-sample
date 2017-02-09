# Auth0 + Alexa - Per-Interaction Authentication Sample

This sample illustrates how it's possible to achieve secure authentication on each interaction with Alexa. At a very high-level this shows how to issue a command to Alexa, receive a one-time use authentication code through a different medium, SMS or email, and then use that code to confirm the transaction through Alexa.

## How it works

1. The user enables your Alexa skill which requires account linking.
2. The user authenticates with your system and grants Alexa access to use your account on your behalf.
3. The user interacts with Alexa and issues a command that requires additional confirmation of the user identity.
4. Your system processes the command, issues and delivers a one-time authentication code to the user associated with the account information provided by Alexa. The authentication code can be delivered either through email or SMS.
5. The user receives the authentication code and communicates it to Alexa which forwards it again to your system.
6. Your system validates the authentication code and confirms the transaction. 

By leveraging a one-time use authentication code delivered through means that have been previously verified as being associated to the end-user, your system can ensure that the transaction was indeed completed by the end-user associated with the account and not by someone else that happened to have access to the Alexa device.

## Behind the scenes

The sample application is built together by mostly gluing together the features already provided by Auth0 and Alexa. When you configure an Alexa skill you can require account linking which means that interactions handled by that skill will include information about the user account that was linked to it when they are communicated to your API. Alexa uses standard OAuth2 flows to enable acting on the user's behalf when interacting with your system so this part is handled by Auth0 API authorization.

The reliance on OAuth2 means Alexa makes no requirements on how the users authenticate into your system which means that no matter how your users authenticate into your system (social, active directory, username and password) they can link their account into the skill because Auth0 will provide an OAuth2 compatible endpoint for all those types of authentication.

Having completed the account linking your API will now be able to know which users is associated with the request that Alexa is relaying. However, your system can't really know for sure if the person that initiated the request was the legitimate user or just someone else with access to the Alexa enabled device where the account was linked.

In order to ensure that the interaction was indeed started by a legitimate user your system can require an additional authentication step with each command issued. This could be a global PIN number, but those are susceptible to being heard when communicated to Alexa. If the transactions allowed thourgh your skill are sensitive, ideally you would require a more strong way of authentication.

You can accomplish this stronger authentication while maintaining the same UX of a PIN number simply by ensuring that each transaction requires a one-time use code in order to be confirmed. The delivery of those code can be done on demand and through email or SMS which means the user can use their phone to quickly obtain the code necessary to complete transaction.

The issuing, delivery and validation of these one-time use authentication codes is accomplished by leveraging Auth0 Passwordless connections. In summary, when a user signs-up to your system he would be automatically provisioned with an Auth0 Passwordless identity associated either to their email or phone number.

## Getting started

### Auth0 configuration

You'll need to configure an API within your Auth0 account that will represent the API that the Alexa skill will call with the necessary access tokens.

Additionally you'll need to configure a regular web application client that will serve double-duty for simplicity purposes. It will represent both the Alexa skill and also our back-end web application. Alexa will use it to request access tokens that can call into the system API and the back-end web application will use it to get access to Auth0 Management API in order to ensure the correct configuration for users.

The previous regular web application client will allow authentication through a database connection and must also have passwordless connections enabled; either email or SMS. By default, the sample will try to use SMS if the user has a phone number available in their profile `user.phone_number` or `user.user_metadata.phone_number` so if you want to force the use of email make sure the user profile does not have any of the previous properties.

### Amazon skill configuration

You need to configure a skill in Amazon Developer Portal before being able to run this sample. All the necessary configuration for the interaction model is available in the `src/alexa` folder.

### Settings

Start by creating a `secrets.ini` file (you can use `secrets.example.ini` as template) under `./src/runtimes/` containing the settings mentioned in the next sections.

The sample is made of the following components:

* An API available at `https://[authority]/[root_path]/alexa` that is called by Alexa and is responsible of parsing those requests and mapping them to the internal application API
* An API available at `https://[authority]/[root_path]/api` that exposes the system services without any dependencies on Alexa
* A web application available at `https://[authority]/[root_path]/app` that represents the system in terms of a traditional web application. For the purposes of this sample this component is not strictly required but it's useful to illustrate how the Alexa skill can complement a normal web application

#### Mandatory settings

```
AUTH0_DOMAIN=[account].auth0.com
API_ID=[Identifier used for the API used by Alexa within Auth0]
API_SIGNING_KEY=[The signing key used for tokens issued to the API]
APP_CLIENT_ID=[The client identifier for the application]
APP_CLIENT_SECRET=[The client secret for the application]
```

#### Optional settings

The Pusher related settings are optional because the web application can function without them; it just won't provide real-time updates.

```
PUSHER_APPID=[Pusher application identifier]
PUSHER_CLUSTER=[Pusher cluster]
PUSHER_KEY=[Pusher key]
PUSHER_SECRET=[Pusher secret]
```

## Development machine deployment

To deploy locally:

```bash
npm install
npm start
```

By default the application root will be made available at `https://pod.localtest.me:7100/wt/`. The specific components of the system are then available as sub-paths of the previous root.

When running locally, Alexa won't be able to reach your machine by default. In order to workaround this you can either make your local deployment available over the Internet and ensure the proper certificate configuration for Alexa or use the Amazon Developer Portal  Service Simulator to to generate the payload of the requests you want to test and then submit them to your local deployment using a tool like Postman.

### Webtask deployment

To deploy to webtask (assuming Webtask CLI is already available and configured):

```bash
npm install
npm run build
wt create -n pod --secrets-file src\runtimes\secrets.ini build\bundle.js
```

The application root will then be available at `https://[webtask_domain]/pod/`.

## Disclaimer

The purpose of this sample is to illustrate how to achieve more secure interaction with Alexa. The provided code should be considered sample code and used only after being thorougly reviewed. In particular, error handling is not meant to be complete and the components of the application that run within the browser depend on resources available in public CDN's.

The sample application was only tested against the latest version of Chrome.