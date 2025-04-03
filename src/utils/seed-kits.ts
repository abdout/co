import connectDB from '@/lib/mongodb';
import Kit from '@/components/kit/model';
import { kit } from '@/constant/kit';

/**
 * Seed kit data to MongoDB
 */
async function seedKits() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Connected to database. Checking for existing kits...');
    
    // Check if we already have kits in the database
    const existingKitsCount = await Kit.countDocuments();
    console.log(`Found ${existingKitsCount} existing kits`);
    
    if (existingKitsCount > 0) {
      console.log('Kits already exist in the database. Skipping seeding.');
      return;
    }
    
    console.log(`Starting to seed ${kit.length} kits...`);
    
    // Track used IDs to ensure uniqueness
    const usedIds = new Set();
    
    // Prepare kit data by adding a name field and ensuring unique IDs
    const preparedKitData = kit.map((item, index) => {
      const idStr = item.id.toString();
      
      // If ID is already used or is "1234" (common duplicate in data), create a unique one
      let uniqueId = idStr;
      if (usedIds.has(idStr) || idStr === "1234") {
        uniqueId = `${idStr}-${index + 1}`;
      }
      
      // Add the ID to used IDs set
      usedIds.add(uniqueId);
      
      return {
        ...item,
        name: item.alt, // Using alt text as the name
        id: uniqueId, // Ensure ID is a unique string
      };
    });
    
    // Insert all kits
    await Kit.insertMany(preparedKitData);
    
    console.log('Successfully seeded all kits!');
  } catch (error) {
    console.error('Error seeding kits:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedKits();
}

export default seedKits; 