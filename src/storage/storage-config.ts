const StorageConfig = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  mediaBucket: process.env.GOOGLE_STORAGE_MEDIA_BUCKET,
};

export default StorageConfig;
