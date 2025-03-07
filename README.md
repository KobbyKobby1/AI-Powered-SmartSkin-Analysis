# Steps to Run the Project

Follow the steps below to run the project locally or build it for production:

---

## 1. **Clone the Repository**

Run the following command in your terminal to clone the project repository:

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 2. **Install Dependencies**

Install all necessary dependencies using npm:

```bash
npm install
```

---

## 3. **Set Up API Configuration**

1. Open the `src/api.ts` file.
2. For **development mode**:
   - Uncomment the following lines:
     ```typescript
     const clientKey = 'your-dev-client-key';
     const baseUrl = 'https://dev.example.com/api';
     ```
   - Comment out the production values:
     ```typescript
     // const clientKey = 'your-prod-client-key';
     // const baseUrl = 'https://prod.example.com/api';
     ```

---

## 4. **Run the Project in Development Mode**

Start the development server by running:

```bash
npm run next:dev
```

By default, the app will be available at [http://localhost:3000](http://localhost:3000).

---

## 5. **Build the Project for Production**

Generate the production build by running:

```bash
npm run next:build
```

The output files will be available in the `build` directory.

Preview Production build

```bash
npm start
```

---

## 6. **Switch Back to Production API**

If you are deploying to production, make sure to switch back to the production API configuration in `src/api.ts`:

- Uncomment the production values:
  ```typescript
  const clientKey = 'your-prod-client-key';
  const baseUrl = 'https://prod.example.com/api';
  ```
- Comment out the development values:
  ```typescript
  // const clientKey = 'your-dev-client-key';
  // const baseUrl = 'https://dev.example.com/api';
  ```

---

## 7. **Test and Deploy**

Once the build is complete, you can deploy the `dist` directory to your hosting provider.

---

## Additional Notes

- Always ensure you are using the correct API keys for the respective environment.
- If you encounter any issues, feel free to submit a GitHub issue or reach out to the project maintainer.

---
