import { connectDatabase } from '../config/db.js';
import { getSiteContent } from '../services/contentService.js';

async function main() {
  await connectDatabase();
  const content = await getSiteContent();
  console.log('Site content seeded/loaded:', content.brand);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
