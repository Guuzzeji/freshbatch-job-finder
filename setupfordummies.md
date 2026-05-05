Hello

If you have had issues setting up FreshBatch and n8n, you've come to the right place.

I will be making a video on this soon, but here are basic instructions.


Prerequisites

Node.js installed
A Google account
A GitHub account (for Freshbatch)

Step 1
Install n8n with

```npx n8n```

Step 2
Set up ngrok by:
-Sign up for free at ngrok.com
-Go to your ngrok dashboard → Domains → claim your free static domain
In a second terminal run:
```ngrok http --domain=your-static-domain.ngrok-free.app 5678```

Step 3
Create a new workflow → Start from scratch
Add a Webhook node
Set HTTP Method to POST
Set Path to jobs
Your production URL will be:
```https://your-static-domain.ngrok-free.app/webhook/jobs```

Step 4 (Best Part)
Go to freshbatch.tech and sign in with GitHub
Go to Delivery Settings
Paste your production webhook URL into the endpoint field
Toggle on the job types you want (internships, new grad)
Hit Save Settings

Boom, your n8n is connecting to freshbatch! After that, the world is your oyster to do things like add the jobs from freshbatch to a Google Sheet.
