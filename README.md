[![LICENCE](https://img.shields.io/github/license/UOSbioinformaticslab/gateway-web)](https://github.com/UOSbioinformaticslab/gateway-web/blob/main/LICENSE)
[![Support](https://img.shields.io/badge/Supported%20By-Cancer%20Research%20UK-2E008B)](https://www.cancerresearchuk.org)

# Gateway Web - Frontend (Next.js)

Welcome to the Gateway Web frontend, a **Next.js** React application that powers the user interface of the Gateway. Maintained by the **University of Sussex Bioinformatics Lab** and supported by **[Cancer Research UK](https://www.cancerresearchuk.org)**, this application facilitates seamless interaction with the [Gateway API](https://github.com/HDRUK/gateway-api-2) using:

- **[fetch](https://nextjs.org/docs/app/api-reference/functions/fetch)** for efficient server-side communication.
- **[SWR](https://swr.vercel.app/)** for optimized client-side data fetching and state management.
- **[i18next](https://www.i18next.com/)** for internationalization and multi-language support.
- **[Jest](https://jestjs.io/)** for unit and snapshot testing.

This project utilizes the **App Router** of Next.js, providing improved performance and flexibility over the traditional Pages Router.

## 🚀 Getting Started

Follow these steps to install and run the project on your local machine.

### Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **npm** or **yarn** (Package manager)
- **Git** (For cloning the repository)

### Installation & Setup

#### 1️⃣ Clone the repository
Open a terminal and execute:
```bash
git clone https://github.com/UOSbioinformaticslab/gateway-web
```

#### 2️⃣ Navigate to the project directory
```bash
cd gateway-web
```

#### 3️⃣ Set up environment variables
Create a `.env.local` file and populate it with appropriate values, using `.env.example` as a reference.

#### 4️⃣ Install dependencies
Run the following command to install the required packages:
```bash
npm install
```

#### 5️⃣ Start the development server
Once dependencies are installed, start the application using:
```bash
npm run dev
```
By default, the application will be available at **[http://localhost:3000](http://localhost:3000)**.

## 🛠 Available Scripts

In the project directory, you can run the following commands:

- **`npm run dev`** – Starts the development server.
- **`npm run build`** – Builds the application for production.
- **`npm start`** – Runs the compiled production build.
- **`npm run lint`** – Runs ESLint to check for code quality issues.
- **`npm run lint:fix`** – Runs ESLint to automatically fix simple lint issues.
- **`npm test`** – Runs the Jest test suite.
- **`npm test:snapshot`** – Runs the Jest test suite to update snapshots.

For a full list of scripts, run `npm run`.

## 📂 Project Structure
A brief overview of the project's folder structure:
```
├── app/                # Next.js pages/api routes/actions
├── components/         # Reusable React components
├── config/             # Reusable configuration throughout the gateway
├── const/              # Constant values
├── hooks/              # React hooks
├── interfaces/         # Types and interfaces
├── modules/            # Module components
├── pages/api           # Legacy APIs that need adapting to App Router APIs
├── providers/          # Provider Wrappers, such as SWR, Snackbars...
├── public/             # Static assets (images, fonts, etc.)
├── seeded/             # Any seeded data during the build process, such as sitemap
├── services/           # Services and clients such as API calls
├── styles/             # Global styles and theme settings
├── types/              # Types and interfaces
├── utils/              # Helper functions and utilities
├── .env.local.example  # Sample environment variables file
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## 🧩 Internationalization (i18next)

This project uses **[i18next](https://www.i18next.com/)** for multilingual support, allowing for seamless language switching and localization. Translations are managed within the `/src/config/messages/` directory and integrated using the `i18next` library.


## 🧪 Testing with Jest

We use **[Jest](https://jestjs.io/)** for unit testing and **React Testing Library** for component testing. Snapshot testing is included to ensure UI consistency.

To run tests:
```bash
npm test
```

To update snapshots:
```bash
npm test:snapshot
```

## 📖 Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [SWR Documentation](https://swr.vercel.app/)
- [i18next Documentation](https://www.i18next.com/)
- [Jest Documentation](https://jestjs.io/)
- [Gateway API](https://github.com/HDRUK/gateway-api-2)

---

This project is maintained by the [University of Sussex Bioinformatics Lab](https://github.com/UOSbioinformaticslab) with support from [Cancer Research UK](https://www.cancerresearchuk.org). To contribute, please [open an issue](https://github.com/UOSbioinformaticslab/gateway-web/issues) or raise a PR!
