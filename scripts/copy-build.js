/**
 *  Copies the built script .js to Firebot's scripts folder
 */
const fs = require('fs').promises;
const path = require('path');

(async () => {
  // find any js files in the dist folder
  const files = await fs.readdir(path.join(__dirname, '..', 'dist'), { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.js')) {
      await fs.copyFile(path.join(__dirname, '..', 'dist', file.name), path.join(__dirname, '..', 'target', file.name));
    }
  }
})();
