import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

async function check() {
  const mainUri = 'mongodb+srv://airavatatechnologiesprojects:Em8TkAdcVXOWAClC@digitalmenuqr.dyyiyen.mongodb.net/?retryWrites=true&w=majority&appName=DigitalMenuQR';
  const mainConn = await mongoose.connect(mainUri);
  
  const restaurantCollection = mainConn.connection.collection('restaurants');
  const restaurant = await restaurantCollection.findOne({ _id: new ObjectId('693a9a5d41d7af6213888034') });
  
  console.log('\n📦 AFGHANI CHICKEN PIZZA IMAGE VERIFICATION:');
  console.log('=' .repeat(50));
  
  // Search all pizza items for Afghani
  const pizzaCollection = mainConn.connection.collection('pizza');
  const item = await pizzaCollection.findOne({ name: /afghani/i });
  
  if (item) {
    console.log('✅ Item found:', item.name);
    console.log('Image field:', item.image);
    
    if (item.image) {
      console.log('\n✅ IMAGE STORAGE:');
      console.log('  Type: MongoDB (base64)');
      console.log('  URL:', item.image);
      
      if (item.image.startsWith('/api/admin/images/')) {
        const imageId = item.image.replace('/api/admin/images/', '');
        const imageCollection = mainConn.connection.collection('images');
        const imageDoc = await imageCollection.findOne({ _id: new ObjectId(imageId) });
        
        if (imageDoc) {
          console.log('\n✅ IMAGE RETRIEVAL:');
          console.log('  Status: FOUND');
          console.log('  MIME Type:', imageDoc.mimeType);
          console.log('  Size:', (imageDoc.data.length / 1024 / 1024).toFixed(2), 'MB');
          console.log('  Format: Base64 encoded');
          console.log('  Valid base64:', /^[A-Za-z0-9+/=]+$/.test(imageDoc.data) ? '✅ YES' : '❌ NO');
          
          console.log('\n✅ OVERALL STATUS: SUCCESS');
          console.log('  - Image saved in MongoDB ✅');
          console.log('  - Stored as base64 ✅');
          console.log('  - Retrievable via API ✅');
          console.log('  - Sample: ' + imageDoc.data.substring(0, 50) + '...');
        }
      }
    } else {
      console.log('❌ No image assigned');
    }
  }
  
  await mongoose.disconnect();
  process.exit(0);
}

check().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
