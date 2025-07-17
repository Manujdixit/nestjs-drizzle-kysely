# NestJS + Drizzle + Kysely Starter Template

A modern, type-safe backend starter template built with NestJS, Drizzle ORM, and Kysely query builder. This template provides a solid foundation for building scalable and maintainable REST APIs with PostgreSQL.

## ✨ Features

- **NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications
- **Drizzle ORM** - Lightweight, type-safe ORM for schema definition and migrations
- **Kysely** - Type-safe SQL query builder for complex queries
- **PostgreSQL** - Robust relational database with full SQL support
- **TypeScript** - Full type safety across the entire application
- **Auto-generated Types** - Database types are automatically generated from your schema
- **Validation** - Request validation using class-validator and class-transformer
- **ESLint + Prettier** - Code formatting and linting
- **Jest** - Unit and integration testing setup
- **Hot Reload** - Development mode with automatic restart

## 🏗️ Architecture

This template combines the best of both worlds:

- **Drizzle ORM** for schema definition, migrations, and simple queries
- **Kysely** for complex, type-safe SQL queries where you need more control
- **NestJS** for dependency injection, decorators, and modular architecture

```
src/
├── database/
│   ├── schema/           # Drizzle schema definitions
│   ├── drizzle/         # Generated migrations
│   ├── generated-types.ts # Auto-generated Kysely types
│   └── database.module.ts # Database configuration
├── users/               # Example users module
│   ├── dto/            # Data transfer objects
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── main.ts
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nestjs-drizzle-kysely
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   PORT=3000
   DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database
   ```

4. **Generate and run migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Generate TypeScript types**

   ```bash
   npm run db:types
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📜 Available Scripts

### Development

- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run start:prod` - Start production server

### Database

- `npm run db:generate` - Generate new migration files
- `npm run db:migrate` - Apply pending migrations
- `npm run db:types` - Generate TypeScript types from database schema
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

## 🗃️ Database Schema

The template includes a sample `users` table defined in `src/database/schema/schema.ts`:

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
```

## 🔧 Usage Examples

### Adding a New Table

1. **Define the schema** in `src/database/schema/schema.ts`:

   ```typescript
   export const posts = pgTable('posts', {
     id: serial('id').primaryKey(),
     title: varchar('title', { length: 255 }).notNull(),
     content: text('content'),
     userId: integer('user_id').references(() => users.id),
     created_at: timestamp('created_at').defaultNow(),
   });
   ```

2. **Generate migration**:

   ```bash
   npm run db:generate
   ```

3. **Apply migration**:

   ```bash
   npm run db:migrate
   ```

4. **Update types**:
   ```bash
   npm run db:types
   ```

### Using Kysely for Complex Queries

```typescript
// In your service
async findUsersWithPostCount() {
  return await this.db
    .selectFrom('users')
    .leftJoin('posts', 'posts.user_id', 'users.id')
    .select([
      'users.id',
      'users.username',
      'users.email',
      (eb) => eb.fn.count('posts.id').as('post_count')
    ])
    .groupBy('users.id')
    .execute();
}
```

### Creating DTOs with Validation

```typescript
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
```

## 🔒 Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 🧪 Testing

The template includes testing setup with Jest:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📊 Database Management

### Drizzle Studio

Open a visual database browser:

```bash
npm run db:studio
```

### Migrations

Generate a new migration after schema changes:

```bash
npm run db:generate
```

Apply pending migrations:

```bash
npm run db:migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT](LICENSE) license.

## 🔗 Useful Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Kysely Documentation](https://kysely.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## ❓ FAQ

**Q: Why use both Drizzle and Kysely?**
A: Drizzle provides excellent schema definition and migration tools, while Kysely offers superior type-safe query building for complex queries. This combination gives you the best of both worlds.

**Q: Can I use a different database?**
A: While this template is configured for PostgreSQL, both Drizzle and Kysely support multiple databases. You'll need to update the configuration and install appropriate drivers.

**Q: How do I deploy this application?**
A: The built application can be deployed to any Node.js hosting platform. Make sure to set your environment variables and run migrations in production.
