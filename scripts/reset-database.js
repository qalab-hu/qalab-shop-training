#!/usr/bin/env node

/**
 * QA Lab Learning App - Cross-Platform Database Reset Script
 * Works on Windows, macOS, and Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to colorize output
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Helper function to execute commands
function executeCommand(command, description) {
  console.log(colorize(`🔄 ${description}...`, 'blue'));
  try {
    execSync(command, { stdio: 'inherit', cwd: projectRoot });
    return true;
  } catch (error) {
    console.error(colorize(`❌ Error: ${error.message}`, 'red'));
    return false;
  }
}

// Get project root directory
const projectRoot = path.resolve(__dirname, '..');

// Check if we're in the right directory
function validateProjectStructure() {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const prismaDir = path.join(projectRoot, 'prisma');
  
  if (!fs.existsSync(packageJsonPath) || !fs.existsSync(prismaDir)) {
    console.error(colorize('❌ Error: Run this script from the project root directory!', 'red'));
    console.error(colorize('Missing package.json or prisma directory.', 'red'));
    process.exit(1);
  }
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promise wrapper for readline question
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Show help information
function showHelp() {
  console.log(colorize('🗄️  QA Lab Database Reset Script', 'cyan'));
  console.log(colorize('====================================', 'cyan'));
  console.log('');
  console.log(colorize('Usage:', 'blue'), 'node scripts/reset-database.js [OPTIONS]');
  console.log('');
  console.log(colorize('Options:', 'blue'));
  console.log('  --clean         Complete reset: Remove ALL data and restore to original state');
  console.log('                  (only default admin@qalab.hu, user@qalab.hu and original products remain)');
  console.log('  --orders-only   Reset only orders data (keep all products and users)');
  console.log('  --user-orders   Reset orders for specific user types (admin/user orders)');
  console.log('  --help, -h      Show this help message');
  console.log('');
  console.log(colorize('Examples:', 'blue'));
  console.log('  node scripts/reset-database.js --clean                    # Complete database reset to original state');
  console.log('  node scripts/reset-database.js --orders-only              # Reset only orders');
  console.log('  node scripts/reset-database.js --user-orders              # Reset user-specific orders');
  console.log('  npm run db:reset                                          # Same as --clean');
  console.log('  npm run db:reset-orders                                   # Same as --orders-only');
  console.log('');
  console.log(colorize('Warning:', 'yellow'), '--clean option removes ALL users and products except defaults!');
  console.log(colorize('Warning:', 'yellow'), 'Always backup important data before running resets!');
}

// Complete database reset
async function resetClean() {
  console.log(colorize('⚠️  COMPLETE RESET - This will remove ALL custom data!', 'yellow'));
  console.log(colorize('Only default users (admin@qalab.hu, user@qalab.hu) and original products will remain.', 'yellow'));
  console.log('');
  console.log(colorize('What will be removed:', 'blue'));
  console.log('  • All manually registered users');
  console.log('  • All custom products');
  console.log('  • All orders');
  console.log('  • All custom data');
  console.log('');
  console.log(colorize('What will remain:', 'blue'));
  console.log('  • admin@qalab.hu user (ADMIN role)');
  console.log('  • user@qalab.hu user (USER role)');
  console.log('  • Original 8 demo products only');
  console.log('');
  
  const confirm = await askQuestion('Are you sure you want to proceed? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log(colorize('❌ Reset cancelled', 'red'));
    return false;
  }
  
  console.log(colorize('🔄 Starting complete database reset...', 'blue'));
  
  // Remove database file if it exists
  const dbPath = path.join(projectRoot, 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    console.log(colorize('🗑️  Removing existing database...', 'blue'));
    fs.unlinkSync(dbPath);
  }
  
  // Regenerate database structure
  if (!executeCommand('npx prisma db push --skip-generate', 'Creating fresh database structure')) {
    return false;
  }
  
  // Seed with original data
  if (!executeCommand('npx prisma db seed', 'Seeding with original data only')) {
    return false;
  }
  
  console.log(colorize('✅ Complete reset finished!', 'green'));
  console.log(colorize('📊 Database now contains only:', 'green'));
  console.log(colorize('   • 2 default users (admin@qalab.hu, user@qalab.hu)', 'green'));
  console.log(colorize('   • 8 original demo products', 'green'));
  console.log(colorize('   • No orders', 'green'));
  
  return true;
}

// Reset orders only
async function resetOrdersOnly() {
  console.log(colorize('📦 Resetting orders only...', 'blue'));
  console.log(colorize('All products and users will be preserved', 'blue'));
  console.log('');
  
  const confirm = await askQuestion('Continue with orders reset? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log(colorize('❌ Reset cancelled', 'red'));
    return false;
  }
  
  console.log(colorize('🗑️  Removing all orders...', 'blue'));
  
  // Create temporary SQL file
  const tempSqlFile = path.join(projectRoot, 'temp_delete_orders.sql');
  const sqlContent = 'DELETE FROM order_items;\nDELETE FROM orders;';
  
  try {
    fs.writeFileSync(tempSqlFile, sqlContent);
    
    if (!executeCommand(`npx prisma db execute --schema prisma/schema.prisma --file "${tempSqlFile}"`, 'Deleting orders')) {
      return false;
    }
    
    // Clean up temp file
    fs.unlinkSync(tempSqlFile);
    
  } catch (error) {
    console.error(colorize(`❌ Error: ${error.message}`, 'red'));
    // Clean up temp file if it exists
    if (fs.existsSync(tempSqlFile)) {
      fs.unlinkSync(tempSqlFile);
    }
    return false;
  }
  
  console.log(colorize('✅ Orders reset completed!', 'green'));
  console.log(colorize('📊 All orders removed, users and products preserved', 'green'));
  
  return true;
}

// Reset user-specific orders
async function resetUserOrders() {
  console.log(colorize('👥 Select user type for order reset:', 'blue'));
  console.log('1) Remove admin orders only');
  console.log('2) Remove regular user orders only');
  console.log('3) Remove all orders (same as --orders-only)');
  console.log('');
  
  const choice = await askQuestion('Select option (1-3): ');
  
  let sqlContent;
  let description;
  
  switch (choice) {
    case '1':
      sqlContent = `DELETE FROM order_items WHERE orderId IN (SELECT id FROM orders WHERE userId IN (SELECT id FROM users WHERE role = 'ADMIN'));
DELETE FROM orders WHERE userId IN (SELECT id FROM users WHERE role = 'ADMIN');`;
      description = 'Removing admin orders';
      break;
    case '2':
      sqlContent = `DELETE FROM order_items WHERE orderId IN (SELECT id FROM orders WHERE userId IN (SELECT id FROM users WHERE role = 'USER'));
DELETE FROM orders WHERE userId IN (SELECT id FROM users WHERE role = 'USER');`;
      description = 'Removing user orders';
      break;
    case '3':
      sqlContent = `DELETE FROM order_items;
DELETE FROM orders;`;
      description = 'Removing all orders';
      break;
    default:
      console.log(colorize('❌ Invalid option', 'red'));
      return false;
  }
  
  console.log(colorize(`🗑️  ${description}...`, 'blue'));
  
  // Create temporary SQL file
  const tempSqlFile = path.join(projectRoot, 'temp_delete_user_orders.sql');
  
  try {
    fs.writeFileSync(tempSqlFile, sqlContent);
    
    if (!executeCommand(`npx prisma db execute --schema prisma/schema.prisma --file "${tempSqlFile}"`, description)) {
      return false;
    }
    
    // Clean up temp file
    fs.unlinkSync(tempSqlFile);
    
  } catch (error) {
    console.error(colorize(`❌ Error: ${error.message}`, 'red'));
    // Clean up temp file if it exists
    if (fs.existsSync(tempSqlFile)) {
      fs.unlinkSync(tempSqlFile);
    }
    return false;
  }
  
  console.log(colorize(`✅ ${description} completed`, 'green'));
  return true;
}

// Main function
async function main() {
  try {
    console.log(colorize('🗄️  QA Lab Database Reset Script', 'cyan'));
    console.log(colorize('====================================', 'cyan'));
    console.log('');
    
    // Validate project structure
    validateProjectStructure();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const option = args[0] || '';
    
    let success = false;
    
    switch (option) {
      case '--clean':
        success = await resetClean();
        break;
      case '--orders-only':
        success = await resetOrdersOnly();
        break;
      case '--user-orders':
        success = await resetUserOrders();
        break;
      case '--help':
      case '-h':
        showHelp();
        success = true;
        break;
      case '':
        console.log(colorize('⚠️  No option specified. Use --help for usage information.', 'yellow'));
        showHelp();
        break;
      default:
        console.log(colorize(`❌ Invalid option: ${option}`, 'red'));
        showHelp();
        break;
    }
    
    rl.close();
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error(colorize(`❌ Unexpected error: ${error.message}`, 'red'));
    rl.close();
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(colorize('\n❌ Operation cancelled by user', 'red'));
  rl.close();
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log(colorize('\n❌ Operation terminated', 'red'));
  rl.close();
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  resetClean,
  resetOrdersOnly,
  resetUserOrders,
  showHelp
};
