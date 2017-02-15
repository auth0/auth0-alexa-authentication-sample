# Step by Step Install

This guide will take you through all the necessary steps required to deploy and run the Alexa skill authentication sample available at [https://github.com/auth0/auth0-alexa-authentication-sample](https://github.com/auth0/auth0-alexa-authentication-sample). The sample in question uses a ficticious pizzaria *Pizza on Demand* (POD) that wants to securely allow their users to order pizzas through their recently developed Alexa skill.

## Pre-Conditions

In order to deploy and run this sample skill you'll need to ensure the provision of the following accounts:

* Auth0 account - [https://auth0.com/](https://auth0.com/)
* Amazon Developer account - [https://developer.amazon.com/home.html](https://developer.amazon.com/home.html)
* *(Optional, but recommended)* Twilio account - [https://www.twilio.com/](https://www.twilio.com/)
* *(Optional)* Pusher account - [https://pusher.com/](https://pusher.com/)

## Auth0 Initial Configuration Steps

The following steps will all be performed through the Auth0 Dashboard available at [https://manage.auth0.com/#/](https://manage.auth0.com/#/).

### `A0:1` - Create the POD Back-End API

On the sidebar at the left select the APIs menu and then click the *CREATE API* button.

> *NOTE*: If you don't see an APIs section on the sidebar make sure that on your **advanced** account settings you enable the *Enable APIs Section* switch.

Provide the following information:

* a *name* at your choice, for example, `POD API`.
* the value `https://pod.localtest.me` for the *identifier* (you could provide a different identifier, but this will be required in other configuration so it's recommended to pick the one used by this guide).
* select `HS256` as the signing algorithm.

Confirm the API creation.

After being navigated to the API details page, choose the Settings section and enable the *Allow Offline Access* switch.

### `A0:2` - Create the POD Client Application

On the sidebar at the left select the Clients menu and then click the *CREATE CLIENT* button.

Provide a *name* at your choice, for example, `POD` and select *Regular Web Applications*  as the client type.

Confirm the client creation.

### `A0:3` - Create a Database Connection

On the sidebar at the left select the Connections menu, then the Database sub-menu and finally click the *CREATE DB CONNECTION* button.

Provide a *name* at your choice, for example, `DB`.

Confirm the database connection creation.

After being navigated to the connection details page, choose the Clients section and ensure that the connection is enabled for the `POD` client application created in the previous step.

### `A0:4` - Create a Test User

On the sidebar at the left select the Users menu and click the *CREATE USER* button.

Provide the following information:

* a real *email* address that you have access to (if you're not going to use Twilio it's strictly required that the email address for the user be a real one).
* a password of your choice.
* select the previously created connection as the connection to which the user is associated.

If you intend to use Twilio to deliver authentication codes to the user mobile phone number, after you get navigated to the user details page you need to click the *EDIT* button in the metadata section and provide the target phone number as part of the `user_metadata`:

```
{
  "phone_number": "[your phone number here]"
}
```

### `A0:5` - Enable Passwordless

On the sidebar at the left select the Connection menu, then the Passwordless sub-menu and enable either the *SMS* or *Email* switch. If you provided a phone number for the test user then **you are required to enable the SMS** option, otherwise, you can choose to enable the Email option and get the authentication codes through your email inbox.

Enabling the SMS option requires you to provide information about your Twilio account. For the Email connection and purely for testing purposes you can use the Auth0 built-in email provider.

In either cases when configuring the chosen type of Passwordless connection you need to set the *OTP Length* to 4 and enable the *Disable Sign Ups* switch.

> **NOTE** - The use of passwordless authentication either with SMS or email require that the phone number or email address of the user be verified before using it to deliver authentication code. For demonstration purposes this sample skill does not require that step so please take that under consideration.

### `A0:6` - Ensure Enabled Connections in POD Client Application

On the sidebar at the left select the Clients menu, locate the entry for the client application create in step `A0:2` and click the *Connections* button available in that client entry row.

Ensure that the only enabled connection for the client are the database connection created in step `A0:3` and the type of Passwordless connection that you enabled in step `A0:5` of this guide.

## Amazon Developer Configuration

The following steps will all be performed through the Amazon Developer Console, in particular, within the Alexa skills list section [https://developer.amazon.com/edw/home.html#/skills/list](https://developer.amazon.com/edw/home.html#/skills/list).

Start the process by clicking on the *Add a New Skill* button.

### `AMZ:1` - Skill Information

Provide the following information:

* Choose `Custom Interaction Model` for the skill type.
* Choose `English (U.S.)` for the language.
* Provide a name at your choice, for example, `POD`.
* Provide an invocation name at your choice, for example, `pizza on demand`.

Click the *Next* button to move to the following step.

### `AMZ:2` - Skill Interaction Model

Click the *Add a Slot Type* button and provide `PIZZA_SIZE` for the slot type *name* and some sample values, for example:

```
Small
Medium
Large
Jumbo
```

Click the *Save* button and wait for the slot type to be processed.

After processing of the previous slot type completes click again in the *Add a Slot Type* button, provide `PIZZA_TOPPINGS` for the slot type *name* and some sample values, for example:

```
Pepperoni
Mushrooms
Onions
Sausage
Bacon
Extra cheese
Black olives
Green peppers
Pineapple
Spinach
Chicken
```

Click the *Save* button and wait for the slot type to be processed.

After adding both slot types, you'll need to provide the *intent schema* and *sample utterances*. The information to add to these fields is available in following files` contained within this sample repository:

* Intent Schema: `src/alexa/IntentSchema.json`
* Sample Utterances: `src/alexa/SampleUtterances.txt`

You can copy/paste the content of those files to the respective form fields. After providing this information click the *Next* button to move to the next step.

### `AMZ:3` - Skill Configuration

Choose `HTTPS` for the service endpoint type and then pick the geographical region that is most applicable to you and provide the URL at which the POD Alexa Skill API will be available. If you plan to strictly follow this guide and deploy the sample as a Webtask associated with your Auth0 account then you can use an URL similar to the following:

```
https://[your auth0 account name].[your auth0 account region].webtask.io/pod/alexa
```

> **NOTE** - The region will either be `us`, `eu` or `au` depending on where your Auth0 account is located.

After configuring the URL, enable the *Account Linking* process and provide the following information:

* For the *Authorization URL* use an URL based on the following template `https://[your auth0 account].auth0.com/authorize?audience=[the identifier of the POD API]`. If you strictly followed this guide the identifier of the POD API will be `https%3A%2F%2Fpod.localtest.me`, otherwise, use the identifier you chose.
* For the *Client Id* use the client identifier of the client application created in step `A0:2` of this guide.
* For the *Domain List* add the domain `cdn.auth0.com` to the list.
* For the *Scope* field add the scopes `openid` and `offline_access` to the list.
* For the *Authorization Grant Type* choose `Auth Code Grant`.
* For the *Access Token URI* use an URL based on the following template `https://[your auth0 account].auth0.com/oauth/token`.
* For the *Client Secret* use the client secret of the client application created in step `A0:2` of this guide.
* For the *Client Authentication Scheme* choose `HTTP Basic`.
For the *Privacy Policy URL*, if the skill will be deployed to Webtask, use an URL based on the following template `https://[your auth0 account name].[your auth0 account region].webtask.io/pod/app#/policy`, otherwise, use a suitable URL.

Before moving to the next step take note of all the URL's listed in the *Redirect URLs* section because you'll later add those to the client application configuration in Auth0.

Click the *Next* button to move to the next step.

### `AMZ:4` - Skill SSL Certificate

If you plan on strictly following this guide the skill will be deployed to Webtask and as such you can choose the option *My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority*, otherwise, you'll need to select the suitable option and proceed accordingly.

At this stage, you've already provided Amazon all the necessary information to enable the test step, however, you'll first need to perform a few additional steps outside the Amazon Developer Console before being able to successfully test it.

## Auth0 Additional Configuration Steps

### `A0:7` - Update POD Client Application Configuration

On the sidebar at the left select the Clients menu, locate the entry for the client application create in step `A0:2` and click the *Settings* button available in that client entry row.

Got the *Allowed Callback URLs* field and add all the redirect URL's you saved in step `AMZ:3`. This URL's will allow the Amazon backend to request and received tokens meant to be used agains the POD API.

If you plan to deploy this sample application in Webtask you can also add an additional redirect URL that will allow the POD website to authenticate users against Auth0. The URL to be added will be similar to the following:

```
https://[your auth0 account name].[your auth0 account region].webtask.io/pod/app/oidc/callback
```

> **NOTE** - For simplicity purposes, both the Amazon back-end and the POD website reuse the same client application configured in Auth0.

## Deployment

For a simplified deployment experience and given that it's for demonstration purposes only this guide will take you through the steps required to deploy the sample skill to a Webtask associated with your Auth0 account.

Before continuing ensure that you have the Webtask CLI installed [https://webtask.io/docs/wt-cli](https://webtask.io/docs/wt-cli).

Given the deploy will use the Webtask associated to your Auth0 account you'll need to access the account settings in the Auth0 Dashboard and then select the Webtask section.

Go through and execute the setup instructions available at that location.

The following steps assume that you already cloned the sample repository locally and that you have an `npm` and `wt-cli` enabled command line open at your local sample working directory.

### Install Node Modules

```bash
npm install
```

### Configure secrets.ini

Start by creating a `secrets.ini` file (you can use `secrets.example.ini` as template) under `/src/runtimes/` containing the settings mentioned in the next sections.

#### Mandatory settings

```
AUTH0_DOMAIN=[your auth0 account domain]
API_ID=[identifier for the API created in step A0:1]
API_SIGNING_KEY=[signing key for the API created in step A0:1]
APP_CLIENT_ID=[client identifier for the application created in step A0:2]
APP_CLIENT_SECRET=[client secret for the application created in step A0:2]
```

#### Optional settings

The Pusher related settings are optional because the web application can function without them; it just won't provide real-time updates. If you have a Pusher account you can create an application to represent this sample and then include the following settings.

```
PUSHER_APPID=[Pusher application identifier]
PUSHER_CLUSTER=[Pusher cluster]
PUSHER_KEY=[Pusher key]
PUSHER_SECRET=[Pusher secret]
```

### Create Deployment Bundle

```bash
npm run build
```

### Create Webtask

In the following command you'll need to add the appropriate Webtask CLI profile using the `-p` option if the default one is not the one associated with the Auth0 account you used to configure the skill.

```bash
wt create -n pod --secrets-file src\runtimes\secrets.ini build\bundle.js
```

After the previous command executes successfully the web application root will be available at `https://[your auth0 account name].[your auth0 account region].webtask.io/pod/`. This application includes the API called by Alexa located at `/pod/alexa/`, a mostly internal API located at `/pod/api/` and a back-end web application available at `/pod/app/`. You can use the last one to quickly check if the deploy went smoothly.

## Installing the Alexa Application

This sample skill requires account linking so before being able to properly test it, you'll need to install the Amazon Alexa application for your mobile platform of choice and go through the account linking.

> **NOTE** - The Alexa application is geo-restricted so you may not be able to install it by default in some countries. However, at least from an Android perspective you can Google/Bing your way out of this small roadblock.

After successfully installing the application you'll need to login with your Amazon account and then access your skills. In this section you should see the skill you configured previously among your listed skills.

Access this skill and go through the account linking process. This process will show you the Auth0 hosted authentication page where you'll be able to login using username/password credentials of the user you created in step `A0:4`.

You're now ready to test your Alexa skill.

## Testing the Skill

### Using the Amazon Developer Console

Access the Alexa skills list section ([https://developer.amazon.com/edw/home.html#/skills/list](https://developer.amazon.com/edw/home.html#/skills/list)) in the Amazon Developer Console and select the skill you created previously.

On the sidebar at the left select the *Test* section and scroll to the *Service Simulator* area.

You can now enter a utterance and review both the request performed by Alexa and the response returned by the deployed skill.

### Using Echosim.io

Access the Echosim.io application at ([https://echosim.io/](https://echosim.io/)) and login with your Amazon account.

Follow the on-screen instructions on how to activate the microphone and talk to Alexa. Given Echosim.io is aimed at simulating an Echo device you'll have to use the skill invocation name you configured in order to first activate the correct skill.
