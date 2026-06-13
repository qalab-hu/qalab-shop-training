# QALab Shop - Playwright Testing Demo

> 🇭🇺 **Magyar verzió**: A teljes dokumentáció magyar nyelven elérhető: [README.md](./README.md)

A modern e-commerce demo application built with Next.js, specifically designed for learning and practicing Playwright automation testing.

## 🎯 Purpose

This application serves as a comprehensive testing playground for QA engineers learning Playwright. It includes various UI elements, forms, API integrations, realistic user interactions, and a complete database-backed authentication system.

## 🚀 Features

### For Testing Practice
- **Complete Authentication System** - JWT-based login with admin/user roles
- **Admin Dashboard** - Product management, user management
- **Contact Forms** - Various input types (text, email, select, radio, checkbox)
- **Product Catalog** - Dynamic content, filtering, search with real database
- **Order Management** - Complete order lifecycle with database persistence
- **API Integration** - RESTful APIs with authentication and validation
- **Responsive Design** - Mobile and desktop testing scenarios

### UI Components Available for Testing
- ✅ Text inputs with validation
- ✅ Email validation  
- ✅ Dropdown selects
- ✅ Radio buttons
- ✅ Checkboxes
- ✅ Textareas
- ✅ Buttons (various states)
- ✅ Navigation menus
- ✅ Modal dialogs
## 📋 Getting Started

### Recommended — Docker Compose (with-docker branch)

The `with-docker` branch includes a full Docker Compose setup (PostgreSQL + Next.js). This is the recommended way to run the project for demos or CI. The `migrate` service runs migrations and seeds automatically.

```bash
# switch to the Docker-focused branch
git checkout with-docker

# build and start the stack (may take a moment on first run)
docker compose up --build -d

# check container status
docker compose ps
```

Stop (keep data):

```bash
docker compose down
```

Stop and remove volumes (delete DB data):

```bash
docker compose down -v
```

App URL: http://localhost:3000

Database connection (for GUI clients or psql):

- Host: `localhost`
- Port: `5432`
- Database: `qalab_shop`
- User: `qalab`
- Password: `qalab_secret`

> Note: If you prefer local development without Docker, see the optional instructions below.

### Optional — Local development (main branch uses SQLite by default)

Prerequisites:

- Node.js 18+
- npm, yarn, or pnpm

Steps (local):

```bash
git checkout main
npm install

# For SQLite (default on main branch)
3. Initialize database:
npm run db:seed
npm run dev
```

Open http://localhost:3000
```bash
npx prisma db push
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 For Playwright Testing

### Demo Credentials
- **Admin User**
  - Email: `admin@qalab.hu`
  - Password: `admin123`
  - Access: Full admin dashboard + product management

- **Regular User**
  - Email: `user@qalab.hu` 
  - Password: `user123`
  - Access: Product browsing and ordering

### API Endpoints
- `GET /api/products` - Fetch products with filtering
- `GET /api/products/[id]` - Fetch single product
- `POST /api/auth/login` - User authentication
- `GET /api/orders` - User orders (authenticated)
- `POST /api/orders` - Create order (authenticated)
- `GET /api/admin/products` - Admin product management

### API Authentication
Two authentication methods available:

1. **JWT Bearer Token** (Recommended)
```bash
# Login to get token
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@qalab.hu", "password": "admin123"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/orders"
```

2. **Legacy API Key**
```bash
curl -H "X-API-Key: qalab-api-key-2024" \
  "http://localhost:3000/api/products"
```

Valid API Keys: `qalab-api-key-2024`, `student-demo-key`, `test-api-key-123`

### Key Testing Scenarios

1. **User Authentication**
   - Admin vs User role-based access
   - JWT token validation
   - Form validation testing
   - Loading states

2. **Contact Form**
   - Multi-step form validation
   - Various input types
   - Success/error handling

3. **Product Management**
   - CRUD operations (Admin only)
   - File upload testing
   - Image handling

4. **Order System**
   - Complete order lifecycle
   - User-specific data access
   - Database transactions

5. **API Testing**
   - JWT authentication flow
   - Role-based endpoint access
   - Request/response validation
   - Error handling
   - Database operations

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication (login, register, profile)
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── admin/         # Admin-only endpoints
│   ├── admin/             # Admin dashboard
│   ├── contact/           # Contact page
│   ├── login/             # Login page
│   ├── products/          # Product catalog
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Site footer
├── lib/                  # Utilities
│   ├── auth.ts           # Authentication helpers
│   ├── auth-utils.ts     # JWT token management
│   ├── db.ts             # Database connection
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
└── prisma/               # Database schema and seed
```

## 📚 Full Documentation

For complete documentation including:
- Detailed API documentation
- Database management
- Troubleshooting guide
- Development workflow

See **[DOKUMENTACIO.md](./DOKUMENTACIO.md)** (Hungarian) for the comprehensive guide.

## 🎓 Learning Objectives

After practicing with this application, you should be comfortable with:

- Writing Playwright tests for authentication flows
- Testing role-based access control
- API testing with JWT tokens
- Database-backed application testing
- File upload and image handling tests
- Form interactions and validation
- Testing dynamic content and loading states
- Cross-browser testing scenarios
- Mobile responsiveness testing
- Error handling and edge cases

## 🚀 Deployment

This application can be easily deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify** 
- **Docker** containers
- Traditional hosting providers

### Vercel Deployment
```bash
npm i -g vercel
vercel
```

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new testing scenarios
- Improve UI components
- Enhance API endpoints
- Add more complex user flows

## 📝 License

This project is created for educational purposes. Feel free to use it in your Playwright learning journey!

---

**Happy Testing!** 🎭🧪

*Built with ❤️ for the QA community*
