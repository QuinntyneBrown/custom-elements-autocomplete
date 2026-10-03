import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const result = spawnSync(
  process.execPath,
  [
    '--experimental-vm-modules',
    fileURLToPath(new URL('../node_modules/jest/bin/jest.js', import.meta.url)),
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
