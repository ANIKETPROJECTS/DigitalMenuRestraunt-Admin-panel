import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  data: String,
  mimeType: String,
  restaurantId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

const menuItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  restaurantId: mongoose.Schema.Types.ObjectId
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

async function checkImage() {
  const uri = 'mongodb+srv://airavatatechnologiesprojects:Em8TkAdcVXOWAClC@digitalmenuqr.dyyiyen.mongodb.net/?retryWrites=true&w=majority&appName=DigitalMenuQR';
  
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Find Afghani Chicken Pizza
    const item = await MenuItem.findOne({ name: 'Afghani Chicken Pizza' });
    
    if (!item) {
      console.log('❌ Afghani Chicken Pizza not found');
      process.exit(0);
    }
    
    console.log('\n✅ Found: Afghani Chicken Pizza');
    console.log('Image field:', item.image);
    
    // Check if it's a MongoDB image ID
    if (item.image && item.image.startsWith('/api/admin/images/')) {
      const imageId = item.image.replace('/api/admin/images/', '');
      console.log('Extracted Image ID:', imageId);
      
      // Check if image exists in Image collection
      const image = await Image.findById(imageId);
      
      if (image) {
        console.log('\n✅ Image FOUND in MongoDB Image collection');
        console.log('MIME Type:', image.mimeType);
        console.log('Base64 Data Length:', image.data.length, 'bytes');
        console.log('First 100 chars of base64:', image.data.substring(0, 100));
        const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(image.data);
        console.log('Valid base64 format:', isValidBase64 ? '✅ YES' : '❌ NO');
      } else {
        console.log('❌ Image NOT found in Image collection');
        console.log('Tried to find image with ID:', imageId);
      }
    } else if (item.image) {
      console.log('⚠️  Image is not a MongoDB reference URL');
      console.log('Current image value:', item.image.substring(0, 100));
    } else {
      console.log('❌ No image assigned to this menu item');
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkImage();
