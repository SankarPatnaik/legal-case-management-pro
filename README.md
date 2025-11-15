# Legal Case Management (MERN + TypeScript) 🚀

A production-ready starter for a **Legal Case Management** system built with:

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Auth:** JWT-based authentication with role-based access control (RBAC)
- **UI:** Tailwind UI-style components and responsive layout
- **Infra Ready:** Dockerized frontend & backend
- **CI/CD:** GitHub Actions workflow skeleton for AWS + ECR deployment

## 1. Project Structure

```text
.
├── backend/               # Express + TS API
├── frontend/              # React + TS + Tailwind SPA
└── .github/workflows/
    └── aws-deploy.yml     # CI/CD skeleton
```

## 2. Backend (Node + Express + TS)

### Setup

```bash
cd backend
cp .env.example .env   # update values
npm install
npm run dev            # local dev (ts-node + nodemon)
npm run build          # build to dist/
npm start              # run compiled JS
```

### Important Scripts

- `npm run dev` – Start dev server with auto-reload
- `npm run build` – TypeScript compile to `dist`
- `npm start` – Run production build

### Environment Variables (`backend/.env.example`)

```text
PORT=4000
MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net
MONGO_DB_NAME=legal_case_mgmt
JWT_SECRET=change-this-to-a-very-strong-secret
CORS_ORIGIN=http://localhost:5173
```

## 3. Frontend (React + Vite + TS + Tailwind)

### Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev        # run on http://localhost:5173
npm run build      # production build
npm run preview    # preview prod
```

### Environment Variables (`frontend/.env.example`)

```text
VITE_API_BASE_URL=http://localhost:4000/api
```

## 4. Docker

### Backend

```bash
cd backend
docker build -t legal-backend:latest .
docker run -p 4000:4000 --env-file .env legal-backend:latest
```

### Frontend

```bash
cd frontend
docker build -t legal-frontend:latest .
docker run -p 8080:80 legal-frontend:latest
```

## 5. GitHub Actions (AWS Deploy Skeleton)

The workflow in `.github/workflows/aws-deploy.yml`:

- Builds backend & frontend
- Builds Docker images
- (Optionally) pushes to **AWS ECR** – you just need to:
  - Set GitHub secrets like `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `ECR_BACKEND_REPO`, `ECR_FRONTEND_REPO`
  - Extend the workflow with ECS/EC2 deployment steps you use in your org

## 6. Auth & RBAC

- JWT token stored in browser `localStorage`
- `AuthContext` and `RequireAuth` + `RequireRole` wrappers
- Roles supported: `ADMIN`, `ATTORNEY`, `PARALEGAL`, `VIEWER`
- Sidebar & navigation rendered based on role

## 7. Notes

- This is a **starting framework** – you can extend data model, workflows, and integrate with your DocuFlow / IDP stack.
- You can plug your GenAI agents on the API layer (e.g., `/api/ai/summariseCase`, `/api/ai/extractEntities`).

Happy hacking! 💡
