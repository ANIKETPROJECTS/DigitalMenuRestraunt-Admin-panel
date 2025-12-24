import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

async function checkImage() {
  const mainUri = 'mongodb+srv://airavatatechnologiesprojects:Em8TkAdcVXOWAClC@digitalmenuqr.dyyiyen.mongodb.net/?retryWrites=true&w=majority&appName=DigitalMenuQR';
  
  try {
    const mainConn = await mongoose.connect(mainUri);
    console.log('✅ Connected to main MongoDB');
    
    // Get restaurant details
    const restaurantCollection = mainConn.connection.collection('restaurants');
    const restaurantId = new ObjectId('693a9a5d41d7af6213888034');
    const restaurant = await restaurantCollection.findOne({ _id: restaurantId });
    
    if (!restaurant) {
      console.log('❌ Restaurant not found');
      process.exit(0);
    }
    
    console.log('✅ Found restaurant:', restaurant.name);
    
    // Check images in main database
    const imageCollection = mainConn.connection.collection('images');
    const allImages = await imageCollection.find({}).limit(5).toArray();
    console.log('\nImages in database:', allImages.length > 0 ? 'YES' : 'NONE');
    
    if (allImages.length > 0) {
      allImages.forEach((img, i) => {
        console.log(`  Image ${i + 1}: ID=${img._id}, mimeType=${img.mimeType}, dataLength=${img.data.length}`);
      });
    }
    
    // Now search for Afghani Chicken Pizza in custom restaurant database
    if (restaurant.mongoUri) {
      console.log('\n🔗 Restaurant has custom mongoUri, connecting...');
      const restConn = await mongoose.createConnection(restaurant.mongoUri);
      
      // Find the pizza collection
      const pizzaCol = restConn.db.collection('pizza');
      const item = await pizzaCol.findOne({ name: 'Afghani Chicken Pizza' });
      
      if (item) {
        console.log('✅ Found in pizza collection');
        console.log('  Name:', item.name);
        console.log('  Image:', item.image);
        
        if (item.image && item.image.startsWith('/api/admin/images/')) {
          const imageId = item.image.replace('/api/admin/images/', '');
          console.log('  Image ID from URL:', imageId);
          
          // Check if image exists in main database
          const imageDoc = await imageCollection.findOne({ _id: new ObjectId(imageId) });
          if (imageDoc) {
            console.log('\n✅ IMAGE VERIFICATION PASSED');
            console.log('  ✅ Image found in MongoDB');
            console.log('  ✅ MIME type:', imageDoc.mimeType);
            console.log('  ✅ Base64 length:', imageDoc.data.length);
            console.log('  ✅ Valid base64:', /^[A-Za-z0-9+/=]+$/.test(imageDoc.data) ? 'YES' : 'NO');
            console.log('  ✅ First 80 chars:', imageDoc.data.substring(0, 80));
          } else {
            console.log('\n❌ IMAGE NOT FOUND in MongoDB');
            console.log('  Image ID used:', imageId);
          }
        }
      } else {
        console.log('❌ Afghani Chicken Pizza not found in pizza collection');
      }
      
      restConn.close();
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkImage();
