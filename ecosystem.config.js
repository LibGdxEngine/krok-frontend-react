module.exports = {
  apps: [
    {
      name: "krok-front",         // Name your app
      script: "npm",
      args: "start",               // Runs the production build with "npm start"
      env: {
        NODE_ENV: "production",    // Set environment to production
      }
    }
  ]
};
