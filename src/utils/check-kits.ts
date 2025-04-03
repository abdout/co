import connectDB from '@/lib/mongodb';
import Kit from '@/components/kit/model';

/**
 * Check kits in the MongoDB database
 */
async function checkKits() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Connected to database. Fetching kits...');
    
    // Get count of kits
    const count = await Kit.countDocuments();
    console.log(`Found ${count} kits in the database`);
    
    // Get all kits
    const kits = await Kit.find({}).sort({ createdAt: -1 });
    
    console.log('Kits in database:');
    kits.forEach((kit, index) => {
      console.log(`${index + 1}. ${kit.name} (ID: ${kit.id})`);
    });
    
  } catch (error) {
    console.error('Error checking kits:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  checkKits();
}

export default checkKits; 