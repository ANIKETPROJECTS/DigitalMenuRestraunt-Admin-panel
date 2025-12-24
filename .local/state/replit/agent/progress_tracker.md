[x] 1. Install the required packages
[x] 2. Restart the workflow to see if the project is working
[x] 3. Verify the project is working using the feedback tool
[x] 4. Inform user the import is completed and they can start building
[x] 5. Answered user question about image storage location and base64 implementation
[x] 6. Fixed image storage to save in restaurant's own MongoDB database:
    - Added getImageModel function in dynamic-mongodb.ts
    - Modified POST /api/admin/upload-image to save to restaurant's database
    - Modified GET /api/admin/images/:restaurantId/:imageId to fetch from restaurant's database
    - Image URL format changed from /api/admin/images/{imageId} to /api/admin/images/{restaurantId}/{imageId}
[x] 7. Restarted workflow and verified server running successfully