Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Setting up Better Auth

1. Create `.env` and copy `.env.example` file in it.
2. Generate and set the `BETTER_AUTH_SECRET` environment variable in your `.env`:

   ```bash
   openssl rand -base64 32
   ```

### Setting up Database (RDS)

1. visit you aws console and navigate to rds.
2. while creating new database  
   a. Under "Choose a database creation method" choose "Easy Create"
   b. Engine options: PostgreSQL
   c. Scroll and keep everything default, Under "Credentials management" choosee "Self managed" and check "Auto generate password"
   d. Hit create database
3. In few seconds you will see this kind of banner:
   ![alt text](image.png)
4. Click on view creds and copy the password
5. Click on the created database, Under "Connectivity & security" tab see if "Connection steps" ( takes little time to populate)
6. After few moments you will get creds in this tab, and using this creds and copied password contruct the db url in .env
7. Click on "Modify" on databse tab, Under "Connectivity" expand "Additional configuration" and check "Publicly accessible".
8. Note down the security group being used.
9. navigate to that security groups (EC2->security groups),click on the group being used on db instance, click on Edit inbound rules and a rule with below configuration:
   a. Type: PostgreSQL
   b. Source: Custom, 0.0.0.0/0

10. run this in the folder of application running and having valid db url env. (Optional,Only for first time setup)

```bash
npx auth@latest generate
```

10. prompt yes to database table modifications.