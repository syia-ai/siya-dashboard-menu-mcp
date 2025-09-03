#!/usr/bin/env node

/**
 * CLI entry point for Siya Dashboard Menu MCP
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, '..', 'dist', 'index.js');

// Pass all arguments to the server
const args = process.argv.slice(2);
const child = spawn('node', [serverPath, ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});