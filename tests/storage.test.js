const { assertFails, assertSucceeds, initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'svo-bio-tech-storage-test',
    storage: {
      rules: readFileSync('storage.rules', 'utf8'),
    },
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearStorage();
});

describe('Firebase Storage Security Rules', () => {

  describe('Products & Blog', () => {
    it('should allow admins to write to products', async () => {
      const adminStorage = testEnv.authenticatedContext('admin', { admin: true }).storage();
      const ref = adminStorage.ref('products/image.png');
      await assertSucceeds(ref.put(new Uint8Array(100), { contentType: 'image/png' }));
    });

    it('should allow anyone to read products', async () => {
      // Setup file first
      const adminStorage = testEnv.authenticatedContext('admin', { admin: true }).storage();
      const refAdmin = adminStorage.ref('products/image2.png');
      await refAdmin.put(new Uint8Array(100), { contentType: 'image/png' });

      // Test read
      const unauthStorage = testEnv.unauthenticatedContext().storage();
      const refUnauth = unauthStorage.ref('products/image2.png');
      await assertSucceeds(refUnauth.getDownloadURL());
    });

    it('should prevent non-admins from writing to products', async () => {
      const aliceStorage = testEnv.authenticatedContext('alice').storage();
      const ref = aliceStorage.ref('products/image.png');
      await assertFails(ref.put(new Uint8Array(100), { contentType: 'image/png' }));
    });
  });

  describe('User Profile Images', () => {
    it('should allow users to upload small images to their own profile', async () => {
      const aliceStorage = testEnv.authenticatedContext('alice').storage();
      const ref = aliceStorage.ref('users/alice/profile.png');
      await assertSucceeds(ref.put(new Uint8Array(100), { contentType: 'image/png' }));
    });

    it('should prevent uploading non-image files to profile', async () => {
      const aliceStorage = testEnv.authenticatedContext('alice').storage();
      const ref = aliceStorage.ref('users/alice/profile.pdf');
      await assertFails(ref.put(new Uint8Array(100), { contentType: 'application/pdf' }));
    });

    it('should prevent users from reading other users profile images', async () => {
      const bobStorage = testEnv.authenticatedContext('bob').storage();
      const ref = bobStorage.ref('users/alice/profile.png');
      // Even if file doesn't exist, permission denied comes first
      await assertFails(ref.getDownloadURL());
    });
  });

});
