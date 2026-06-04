# Employee Management System API

Base URL: `http://localhost:5000/api`

Send protected requests with:

```http
Authorization: Bearer <jwt-token>
```

## Auth

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Login and receive JWT |
| POST | `/auth/register` | Public | Employee self-registration with default Employee role |
| GET | `/auth/public-departments` | Public | Department list for registration |
| POST | `/auth/logout` | Authenticated | Client-side logout helper |
| GET | `/auth/me` | Authenticated | Current user profile |
| PUT | `/auth/profile` | Authenticated | Update own name, phone, address, profile picture |
| PUT | `/auth/change-password` | Authenticated | Change own password |

Login body:

```json
{
  "email": "admin@example.com",
  "password": "Admin@12345"
}
```

## Employees

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/employees?page=1&limit=10&search=&department=&status=` | Admin, HR | List employees with pagination, search, filters |
| GET | `/employees/export` | Admin, HR | Export filtered employees as an Excel-compatible CSV |
| GET | `/employees/:id` | Admin, HR | Employee details |
| POST | `/employees` | Admin, HR | Create employee, supports `multipart/form-data` |
| PUT | `/employees/:id` | Admin, HR | Update employee, supports `multipart/form-data` |
| DELETE | `/employees/:id` | Admin | Delete employee and attendance records |

Employee fields: `name`, `email`, `password`, `phone`, `address`, `department`, `designation`, `salary`, `joiningDate`, `status`, `role`, `profilePicture`.

## Departments

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/departments` | Authenticated | List departments with employee counts |
| POST | `/departments` | Admin, HR | Create department |
| PUT | `/departments/:id` | Admin, HR | Update department |
| DELETE | `/departments/:id` | Admin | Delete unused department |

## Attendance

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| POST | `/attendance/mark` | Authenticated | Mark attendance for self; Admin/HR may include `employee` |
| POST | `/attendance/admin-mark` | Admin, HR | Mark attendance for selected employee |
| PUT | `/attendance/checkout` | Authenticated | Set today's checkout time |
| GET | `/attendance/history` | Authenticated | Attendance records |
| GET | `/attendance/monthly-report?month=6&year=2026` | Authenticated | Monthly records and grouped report |
| GET | `/attendance/statistics` | Authenticated | Today and overall attendance statistics |

## Dashboard and Audit

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/dashboard` | Admin, HR | Employee, attendance, department analytics |
| GET | `/audit-logs` | Admin | Paginated audit logs |
