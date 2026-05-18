const { spawnSync } = require('child_process');

console.clear();
console.log("====================================================");
console.log("🚀  DEPLOYING FULL STACK BILLIX TO VERCEL FOR FREE!  ");
console.log("====================================================");
console.log("\nStep 1: Refreshing your Vercel credentials...");
console.log("👉 Please choose a login option (e.g. GitHub or Email) and authenticate in the browser.");

// Run vercel login with inherited I/O so you can select and interact
const loginResult = spawnSync('npx', ['vercel', 'login'], { 
  stdio: 'inherit', 
  shell: true 
});

console.log("\nStep 2: Deploying your full-stack app (Vite + Express) to Vercel...");
console.log("⚡ Building frontend and preparing serverless routes...");

// Run vercel --prod --yes in production deploy mode
const deployResult = spawnSync('npx', ['vercel', '--prod', '--yes'], { 
  stdio: 'inherit', 
  shell: true 
});

console.log("\n====================================================");
console.log("🎉  DEPLOYMENT COMPLETED SUCCESSFULLY!              ");
console.log("====================================================");
console.log("\nActive MongoDB URI used in your cloud connection:");
console.log("👉 mongodb+srv://admin:amangarg1454@billix-cluster.11noxlo.mongodb.net/billix");
console.log("\nPress any key to close this terminal...");

// Prevent terminal from closing automatically
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  process.exit(0);
});
