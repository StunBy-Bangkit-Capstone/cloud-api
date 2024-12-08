
# Cloud API Backend Server

Welcome to the **Cloud API Backend Server** repository. This backend service powers the StunBy platform, providing essential APIs for application functionalities.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

To get started with the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/StunBy-Bangkit-Capstone/cloud-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cloud-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   Ensure you have Node.js and npm installed before running this command.

---

## Setup

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-jwt-secret>
CLOUD_STORAGE_BUCKET=<your-cloud-storage-bucket>
```

Replace `<your-database-url>`, `<your-jwt-secret>`, and `<your-cloud-storage-bucket>` with your actual configuration values.

### Database Migration

Run the following command to apply database migrations:

```bash
npx prisma migrate dev
```

### Start the Server

To run the server in development mode:

```bash
npm run dev
```

For production mode:

```bash
npm start
```

The backend will be running on `http://localhost:3000` by default.

---

## Features

- **Authentication**: User registration, login, and token-based authentication.
- **Cloud Integration**: Handles cloud storage interactions using Cloud Run.
- **Database Management**: Efficient and optimized data storage using Prisma ORM.
- **Scalable CI/CD**: Deployed using GitHub Actions integrated with Google Cloud Run.

---

## API Documentation

Comprehensive API documentation is available in the `docs` folder. Refer to `docs/api-docs.md` for detailed usage instructions, including:

- [API Documentation](docs/api-cc.md) 
- [ML Model Documentation](docs/api-ml.md) 

---

## Deployment

The project is configured for Continuous Integration/Continuous Deployment (CI/CD) with GitHub Actions and Google Cloud Run. Follow these steps to deploy:

1. Push changes to the `main` branch:
   ```bash
   git push origin main
   ```

2. The CI/CD pipeline will automatically build and deploy the project to Cloud Run.

3. To monitor deployment logs, visit your Google Cloud Console.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push your branch and open a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
