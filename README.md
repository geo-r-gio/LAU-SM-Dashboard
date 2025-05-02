
# LAU-SM Dashboard

The **LAU-SM Dashboard** is a centralized coordination system developed to streamline the management of delegates and advisors in student simulation programs. The system supports role-based access control, real-time data updates, and interactive interfaces for registration, attendance, and reporting.

---

## 🚀 Getting Started

Follow these steps to set up and run the entire project.

---

### 📁 1. Open the Project

Open the project folder in any code editor (e.g., **VS Code**).

---

### 📦 2. Install Dependencies

Open two terminal windows and run the following commands:

#### Frontend Setup
```bash
cd client
npm install
```

#### Backend Setup
```bash
cd server
npm install
```

---

### 🗄️ 3. Database Setup

1. Locate the file named `LAUSM.txt` inside the root directory.
2. Open your MySQL Workbench (or any SQL client).
3. Copy and execute **all the SQL queries** from `LAUSM.txt` to create the necessary tables and seed the database with initial data.

> Ensure your MySQL server is running.

---

### ⚙️ 4. Configure Database Credentials

Open the file:

```
database/database.js
```

Update the following fields with your MySQL Workbench credentials:
```js
user: "your_mysql_username",
password: "your_mysql_password",
```

Make sure the database name is consistent with what's in `LAUSM.txt` (default: `lausmdb`).

---

### 🔐 5. One-Time Password Hashing

To securely hash the default login credentials:

1. Open:
```
server/server.js
```

2. Uncomment the following line:
```js
// hashAllPasswordsOnce();
```

3. In the terminal, run:
```bash
node server.js
```

4. Once the process completes (you'll see a success message), **comment that line again** to prevent repeated hashing:
```js
// hashAllPasswordsOnce();
```

---

### 💻 6. Run the Project

#### Start the Client
```bash
cd client
npm run dev
```

#### Start the Server
```bash
cd server
node server.js
```

---

### 🔓 7. Access the Dashboard

Once both the client and server are running:

👉 Open your browser and go to:
```
http://localhost:5173
```

Use the default credentials (as inserted via `LAUSM.txt`) to sign in as an Outreach Coordinator.

---

## 🎯 Features

- Role-based authentication (Coordinators only)
- Advisor and delegate registration with validation
- Auto-generated delegate/advisor IDs
- Class and country assignment logic
- Attendance tracking
- Real-time dashboard statistics

---

## 🧠 Technologies Used

- **Frontend**: React.js, Material UI (MUI), Formik, Yup, Axios
- **Backend**: Node.js, Express.js, MySQL
- **Database**: MySQL (with custom logic for assignment & validation)
- **State Management**: Redux (for theme switching)
- **Styling**: CSS + MUI Theming

---

## 🛠 Troubleshooting

- Make sure MySQL server is running.
- Check database username/password if login fails.
- If the login fails after hashing, verify that the credentials in the `login` table are hashed correctly.
- If any SQL queries fail, verify that all tables were created correctly in `LAUSM.txt`.

---

## 📄 License

This project is intended for academic use only.
