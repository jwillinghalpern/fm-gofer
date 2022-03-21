const fs = require('fs');

fs.rename('./dist/src/index.d.ts', './dist/fm-gofer.d.ts', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
fs.rmdir('./dist/src', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('dist/src directory removed!');
});
fs.rmdir('./dist/example', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('dist/example directory removed!');
});
