# "Sledstvie Veli" Detective Agency - Website

A professional, multilingual website layout for a detective agency with a fully functional backend to process contact form submissions and store them securely in a database.

## Features

-   **Clean Semantic Layout:** Built using modern HTML5, CSS3 grid/flexbox, and vanilla JavaScript.
-   **Structured Architecture:** Clean and professional separate directory system (`/css`, `/js`, `/images`, `/fonts`).
-   **Smart UX Components:** Customized JS image slider and a dynamic, adaptive phone input mask applied globally across all forms. It automatically detects the country code: formatting RU/CIS numbers with standard brackets (`+7 (XXX) XXX-XX-XX`) and dynamically switching to an open international layout (`+X XXX XXX...`) for foreign numbers while adjusting placeholders on the fly.
-   **Secure Backend:** Powered by Node.js and Express to handle asynchronous AJAX (`fetch`) form requests.
-   **Database Automation:** Integrated with PostgreSQL. The backend automatically detects, creates, and verifies the target database and tables upon server startup.
-   **Security Minded:** Sensitive credentials and system parameters are protected via environment variables (`.env`).

## Tech Stack

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL
-   **Dependencies:** `pg`, `dotenv`

---

## Local Setup Instructions

Follow these steps to clone, configure, and launch the project on your local machine:

### 1. Prerequisites
Ensure you have **Node.js** (LTS version recommended) and **PostgreSQL** installed and running on your computer.

### 2. Install Dependencies
Clone the repository, open your terminal in the project root folder, and regenerate the `node_modules` folder:
```bash
npm install
```

### 3. Environment Configuration
Create a file named `.env` in the root directory (use `.env.example` as a template) and add your local PostgreSQL system password:
```text
DB_PASSWORD=your_actual_postgresql_password_here
```

### 4. Start the Server
Run the local Node.js web server:
```bash
node server.js
```

### 5. Access the Website
Open your web browser and navigate to the local server address:
- Main Page: [http://localhost:3000/main.html](http://localhost:3000/main.html)
- Services Directory: [http://localhost:3000/services.html](http://localhost:3000/services.html)

Upon startup, the server will output log confirmations showing that the `detective_agency` database and `contacts_requests` tables are fully synchronized and listening for submissions.