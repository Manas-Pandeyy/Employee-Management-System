# Employee Management System - MERN Stack

A complete Employee Management System built with MongoDB, Express.js, React.js, and Node.js. It includes JWT auth, role-based access control, employee CRUD, departments, attendance, profile picture uploads, Excel-compatible export, email notification hooks, audit logs, dashboard analytics, pagination, validation, and responsive UI.

## Folder Structure

```text
Emp_Mgmt_System/
  backend/
    src/
      config/          MongoDB connection
      controllers/     API business logic
      middleware/      Auth, RBAC, upload, validation, errors, audit
      models/          Mongoose schemas
      routes/          REST API routes
      seeders/         Sample data
      utils/           JWT, email, async helpers
      validators/      express-validator rules
    uploads/           Profile images
  frontend/
    src/
      api/             Axios client
      components/      Layout, protected routes, UI helpers
      context/         Auth Context API
      pages/           App screens
      styles/          Global responsive CSS
  docs/API.md          API documentation
```

## Database Schema

Employee:

- `name`, `email`, `password`, `phone`, `address`
- `department` reference
- `designation`, `salary`, `joiningDate`
- `status`: `Active` or `Inactive`
- `role`: `Admin`, `HR`, or `Employee`
- `profilePicture`

Department:

- `name`
- `description`

Attendance:

- `employee` reference
- `date`
- `checkInTime`
- `checkOutTime`
- `status`: `Present`, `Absent`, `Half Day`, or `On Leave`

AuditLog:

- `actor`, `action`, `entity`, `entityId`, `ipAddress`, `userAgent`

## Step-by-Step Commands

### Backend

```powershell
cd D:\Emp_Mgmt_System\backend
corepack npm install
Copy-Item .env.example .env
```

Edit `backend\.env` and set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/employee_management_system
JWT_SECRET=your-long-random-secret
CLIENT_URL=http://localhost:5173
```

Start MongoDB locally, then run:

```powershell
corepack npm run seed
corepack npm run dev
```

Backend URL:

```text
http://localhost:5000/api
```

### Frontend

Open a second terminal:

```powershell
cd D:\Emp_Mgmt_System\frontend
corepack npm install
Copy-Item .env.example .env
corepack npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Admin@12345` |
| HR | `hr@example.com` | `Hr@12345` |
| Employee | `employee@example.com` | `Employee@12345` |

## Production Notes

- Use a strong `JWT_SECRET`.
- Configure SMTP values in `backend/.env` to enable real email notifications.
- Store uploads in cloud storage for distributed production deployments.
- Put the backend behind HTTPS and a reverse proxy.
- Set `NODE_ENV=production`.
- Restrict CORS `CLIENT_URL` to the deployed frontend domain.

## API Documentation

See [docs/API.md](docs/API.md).
