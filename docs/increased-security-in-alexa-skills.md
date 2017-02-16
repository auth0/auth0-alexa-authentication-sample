# Increasing Security of Alexa Skill Interactions

## What You Have Right Now

You have an online business that provides products or services to end-users. These users are billed depending on the actions they perform when engaging with your business. They can perform these actions either through your web or mobile applications after they have successfully authenticated with your systems.

In order to make these interactions as simple as possible for end-users you either already implemented or were considering implementing an Alexa skill. However, you're concerned with the fact that Alexa responds to voice commands without discerning who the actual user is. This means that everyone that has access to the Alexa device used by your real users can impersonate your system end-user and perform actions within your system.

You considered provisioning and then requiring a global PIN number to all your end-users so that they can verify their transactions through the Alexa skill using that PIN number. Despite of this additional requirement, you're still concerned that this PIN can be leaked and reused by someone else.

## What You Would Like to Have

You want to be sure that any sensitive transaction started through your Alexa skill is guaranteed to have been initiated by the user that has an account on your system.

You want to improve upon the global PIN solution so that each transaction is authenticated through a one-time authentication code in order to mitigate against replay attacks.

## How to Implement It

You leverage the infrastructure and one-time password generation and validation logic available within [Auth0 Passwordless](https://auth0.com/passwordless) to implement a system that can provide single-use authentication codes to users performing actions through your Alexa skill.

Given that Auth0 Passwordless allows the delivery of these codes either through email or SMS you can increase the security of your Alexa enabled transaction by ensuring an additional degree of authentication because in theory only the real user will have access to their verified email address or phone number.

Implementation steps:

1. If you haven't done so already, register for an Auth0 account.
2. Create a client application in Auth0 Dashboard to represent your skill.
3. Configure Auth0 Passwordless.
4. Provision your existing users within Auth0 Passwordless.
5. Update your skill to issue and then challenge the user with an authentication code managed through Auth0 Passwordless.