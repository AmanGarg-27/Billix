const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log("====================================================");
console.log("🚀  BILLIX ZEROQUEUE - AUTOMATED HOSTING WIZARD    🚀");
console.log("====================================================");
console.log("\nSince hosting requires your personal credentials for safety,");
console.log("I will guide you through this process in less than 30 seconds!");
console.log("\nStep 1: Pushing your code to a new GitHub repository...");

// Open browser to create new repository
console.log("\n🔗 Opening GitHub in your browser to create a new repository...");
try {
  // Prefill the repository name as billix-zeroqueue
  execSync('start https://github.com/new?name=billix-zeroqueue');
} catch (e) {
  console.log("Could not open browser automatically. Please open: https://github.com/new");
}

rl.question('\n👉 Please paste the URL of the new GitHub repository you just created:\n(e.g., https://github.com/your-username/billix-zeroqueue.git)\n\nURL: ', (repoUrl) => {
  const cleanUrl = repoUrl.trim();
  if (!cleanUrl) {
    console.log("❌ Invalid URL. Exiting wizard.");
    rl.close();
    process.exit(1);
  }

  console.log("\n📦 Linking repository and pushing code...");
  try {
    // Add remote
    try {
      execSync('git remote remove origin', { stdio: 'ignore' });
    } catch(e) {}
    
    execSync(`git remote add origin ${cleanUrl}`);
    console.log("✓ GitHub remote linked successfully.");

    // Rename branch to main
    execSync('git branch -M main');
    
    console.log("⬆️ Pushing code to GitHub (this may take a few seconds)...");
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log("\n✅ Code pushed to GitHub successfully!");
    console.log("\nStep 2: Connecting your GitHub repo to Render...");
    console.log("🔗 Opening Render dashboard in your browser...");
    
    // Open Render repository selector
    setTimeout(() => {
      try {
        execSync('start https://dashboard.render.com/select-repo?type=web');
      } catch (e) {
        console.log("Could not open browser automatically. Please open: https://dashboard.render.com");
      }
      
      console.log("\n====================================================");
      console.log("🎉 DEPLOYMENT SETTINGS TO USE ON RENDER:            ");
      console.log("====================================================");
      console.log("1. Build Command:  npm install && npm run build && cd server && npm install");
      console.log("2. Start Command:  cd server && node server.js");
      console.log("3. Environment Variables (Click Advanced):");
      console.log("   - Key:   MONGO_URI");
      console.log("   - Value: mongodb+srv://admin:amangarg1454@billix-cluster.11noxlo.mongodb.net/billix?appName=Billix-Cluster");
      console.log("====================================================");
      console.log("\nHosting Wizard Complete! Have fun with your live site! 🚀");
      rl.close();
    }, 2000);

  } catch (err) {
    console.log("\n❌ Git push failed. Please ensure you are logged into GitHub on your computer terminal.");
    console.log("You can manually run: git push -u origin main");
    rl.close();
  }
});
