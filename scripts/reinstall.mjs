import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';

// Clean up old node_modules and lockfile
if (existsSync('/vercel/share/v0-project/node_modules')) {
  console.log('Removing node_modules...');
  rmSync('/vercel/share/v0-project/node_modules', { recursive: true, force: true });
  console.log('Removed node_modules');
}

if (existsSync('/vercel/share/v0-project/package-lock.json')) {
  console.log('Removing package-lock.json...');
  rmSync('/vercel/share/v0-project/package-lock.json');
  console.log('Removed package-lock.json');
}

// Run npm install with legacy-peer-deps
console.log('Running npm install --legacy-peer-deps...');
try {
  const output = execSync('npm install --legacy-peer-deps', {
    cwd: '/vercel/share/v0-project',
    stdio: 'pipe',
    timeout: 120000,
  });
  console.log(output.toString());
  console.log('npm install completed successfully!');
} catch (err) {
  console.error('npm install failed:', err.stderr?.toString() || err.message);
  console.log('stdout:', err.stdout?.toString());
}
