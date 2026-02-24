import { execSync } from 'child_process';

try {
  console.log('Pulling latest changes from origin main...');
  const output = execSync('git pull origin main', {
    cwd: '/vercel/share/v0-project',
    encoding: 'utf-8'
  });
  console.log(output);
  console.log('Git pull completed successfully!');
} catch (error) {
  console.error('Error during git pull:', error.message);
  process.exit(1);
}
