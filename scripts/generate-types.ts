import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateTypes() {
  try {
    // Generate types from database
    await execAsync(
      'npx kysely-codegen --out-file src/database/generated-types.ts',
    );
    console.log('Types generated successfully!');
  } catch (error) {
    console.error('Error generating types:', error);
  }
}

generateTypes();
