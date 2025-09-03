/**
 * Post-install script for Siya Dashboard Menu MCP
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Setting up Siya Dashboard Menu MCP...');

// Create .env file if it doesn't exist
const envPath = join(__dirname, '.env');
const envExamplePath = join(__dirname, '.env.example');

if (!existsSync(envPath) && existsSync(envExamplePath)) {
  console.log('📝 Creating .env file from template...');
  const envExample = readFileSync(envExamplePath, 'utf8');
  writeFileSync(envPath, envExample);
  console.log('✅ Created .env file - please update with your GitHub token');
} else if (existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('⚠️  No .env.example found to create .env file');
}

console.log('');
console.log('🔧 Setup Instructions:');
console.log('1. Update .env file with your GitHub personal access token');
console.log('2. Ensure the token has repository access to syia-ai/app-insights-v2');
console.log('3. Run: npm run build');
console.log('4. Test with: npm test');
console.log('');
console.log('📚 Available tools:');
console.log('- get_dashboard_config: Get current config');
console.log('- list_clients: List all clients');
console.log('- create_client_menu: Create new client');
console.log('- update_client_menu: Update existing client');
console.log('- add_menu_section: Add menu section');
console.log('- update_menu_section: Update menu section');
console.log('- delete_menu_section: Delete menu section');
console.log('');
console.log('✨ Setup complete!');