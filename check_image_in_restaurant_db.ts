import mongoose from 'mongoose';

async function checkImage() {
  const mainUri = 'mongodb+srv://airavatatechnologiesprojects:Em8TkAdcVXOWAClC@digitalmenuqr.dyyiyen.mongodb.net/?retryWrites=true&w=majority&appName=DigitalMenuQR';
  
  try {
    // Connect to main database to get restaurant info
    const mainConn = await mongoose.connect(mainUri);
    console.log('✅ Connected to main MongoDB');
    
    const restaurantCollection = mainConn.connection.collection('restaurants');
    const restaurant = await restaurantCollection.findOne({ _id: require('mongodb').ObjectId.createFromHexString('693a9a5d41d7af6213888034') });
    
    if (!restaurant) {
      console.log('❌ Restaurant not found');
      process.exit(0);
    }
    
    console.log('✅ Found restaurant:', restaurant.name);
    console.log('Restaurant mongoUri:', restaurant.mongoUri ? 'YES' : 'NO');
    
    if (!restaurant.mongoUri) {
      console.log('❌ Restaurant has no mongoUri - using main database');
    } else {
      console.log('\n📍 Connecting to restaurant custom database...');
      
      // Connect to restaurant database
      const restConn = await mongoose.createConnection(restaurant.mongoUri);
      
      // Look for menu items in the pizzas collection (or potrice collection)
      const collections = await restConn.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name).join(', '));
      
      // Search in pizza collection
      const pizzaCollection = restConn.db.collection('pizza');
      const item = await pizzaCollection.findOne({ name: 'Afghani Chicken Pizza' });
      
      if (item) {
        console.log('\n✅ Found Afghani Chicken Pizza in pizza collection');
        console.log('Image:', item.image);
        
        if (item.image && item.image.startsWith('/api/admin/images/')) {
          const imageId = item.image.replace('/api/admin/images/', '');
          console.log('Image ID:', imageId);
          
          // Check Image collection in main database
          const imageCollection = mainConn.connection.collection('images');
          const imageDoc = await imageCollection.findOne({ _id: require('mongodb').ObjectId.createFromHexString(imageId) });
          
          if (imageDoc) {
            console.log('\n✅ Image FOUND in MongoDB');
            console.log('MIME Type:', imageDoc.mimeType);
            console.log('Base64 Data Length:', imageDoc.data.length, 'bytes');
            console.log('First 100 chars:', imageDoc.data.substring(0, 100));
            const isValid = /^[A-Za-z0-9+/=]+$/.test(imageDoc.data);
            console.log('Valid base64:', isValid ? '✅ YES' : '❌ NO');
          } else {
            console.log('❌ Image document not found with ID:', imageId);
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
