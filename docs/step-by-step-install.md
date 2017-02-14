# Step by Step Install

This guide will take you through all the necessary steps required to deploy and run the Alexa skill authentication sample available at [https://github.com/auth0/auth0-alexa-authentication-sample](https://github.com/auth0/auth0-alexa-authentication-sample). The sample in question uses a ficticious pizzaria *Pizza on Demand* (POD) that wants to securely allow their users to order pizzas through their recently developed Alexa skill.

## Pre-Conditions

In order to deploy and run this sample skill you'll need to ensure the provision of the following accounts:

* Auth0 account - [https://auth0.com/](https://auth0.com/)
* Amazon Developer account - [https://developer.amazon.com/home.html](https://developer.amazon.com/home.html)
* *(Optional, but recommended)* Twilio account - [https://www.twilio.com/](https://www.twilio.com/)
* *(Optional)* Pusher account - [https://pusher.com/](https://pusher.com/)

## Auth0 Configuration Steps

The following steps will all be performed through the Auth0 Dashboard available at [https://manage.auth0.com/#/](https://manage.auth0.com/#/).

### `A0:1` - Create the POD Back-End API

On the sidebar at the right select the APIs menu and then click the *CREATE API* button.

> *NOTE*: If you don't see an APIs section on the sidebar make sure that on your **advanced** account settings you enable the *Enable APIs Section* switch.

Provide the following information:

* a *name* at your choice, for example, `POD API`.
* the value `https://pod.localtest.me` for the *identifier* (you could provide a different identifier, but this will be required in other configuration so it's recommended to pick the one used by this guide).
* select `HS256` as the signing algorithm.

Confirm the API creation.

After being navigated to the API details page, choose the Settings section and enable the *Allow Offline Access* switch.

### `A0:2` - Create the POD Client Application

On the sidebar at the right select the Clients menu and then click the *CREATE CLIENT* button.

Provide a *name* at your choice, for example, `POD` and select *Regular Web Applications*  as the client type.

Confirm the client creation.

### `A0:3` - Create a Database Connection

On the sidebar at the right select the Connections menu, then the Database sub-menu and finally click the *CREATE DB CONNECTION* button.

Provide a *name* at your choice, for example, `DB`.

Confirm the database connection creation.

After being navigated to the connection details page, choose the Clients section and ensure that the connection is enabled for the `POD` client application created in the previous step.

### `A0:4` - Create a Test User

On the sidebar at the right select the Users menu and click the *CREATE USER* button.

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

On the sidebar at the right select the Connection menu, then the Passwordless sub-menu and enable either the *SMS* or *Email* switch. If you provided a phone number for the test user then **you are required to enable the SMS** option, otherwise, you can choose to enable the Email option and get the authentication codes through your email inbox.

Enabling the SMS option requires you to provide information about your Twilio account. For the Email connection and purely for testing purposes you can use the Auth0 built-in email provider.

In either cases when configuring the chosen type of Passwordless connection you need to set the *OTP Length* to 4 and enable the *Disable Sign Ups* switch.

### `A0:6` - Ensure Enabled Connections in POD Client Application

On the sidebar at the right select the Clients menu, locate the entry for the client application create in step `A0:2` and click the *Connections* button available in that client entry row.

Ensure that the only enabled connection for the client are the database connection created in step `A0:3` and the type of Passwordless connection that you enabled in step `A0:5` of this guide.

## Amazon Developer Configuration

The following steps will all be performed through the Amazon Developer Console, in particular, within the Alexa skills list section [https://developer.amazon.com/edw/home.html#/skills/list](https://developer.amazon.com/edw/home.html#/skills/list).

Start the process by clicking on the *Add a New Skill* button.

### `AMZ:1` - Provide Skill Information