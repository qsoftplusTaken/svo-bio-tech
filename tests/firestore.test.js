const { assertFails, assertSucceeds, initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'svo-bio-tech-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules', () => {
  
  describe('Products', () => {
    it('should allow anyone to read products', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertSucceeds(unauthDb.collection('products').doc('prod1').get());
    });

    it('should prevent non-admins from writing products', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(aliceDb.collection('products').doc('prod1').set({ name: 'Test Product' }));
    });

    it('should allow admins to write products', async () => {
      const adminDb = testEnv.authenticatedContext('admin', { admin: true }).firestore();
      await assertSucceeds(adminDb.collection('products').doc('prod1').set({ name: 'Test Product' }));
    });
  });

  describe('Orders', () => {
    it('should allow authenticated users to create their own orders', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      await assertSucceeds(aliceDb.collection('orders').doc('order1').set({ userId: 'alice', amount: 100 }));
    });

    it('should prevent authenticated users from creating orders for others', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(aliceDb.collection('orders').doc('order1').set({ userId: 'bob', amount: 100 }));
    });

    it('should allow users to read their own orders', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      // Setup order with admin bypass
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('orders').doc('order1').set({ userId: 'alice' });
      });
      await assertSucceeds(aliceDb.collection('orders').doc('order1').get());
    });

    it('should prevent users from reading others orders', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('orders').doc('order2').set({ userId: 'bob' });
      });
      await assertFails(aliceDb.collection('orders').doc('order2').get());
    });

    it('should allow admin to read and delete any order', async () => {
      const adminDb = testEnv.authenticatedContext('admin', { admin: true }).firestore();
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('orders').doc('order3').set({ userId: 'alice' });
      });
      await assertSucceeds(adminDb.collection('orders').doc('order3').get());
      await assertSucceeds(adminDb.collection('orders').doc('order3').delete());
    });
  });

  describe('Reviews', () => {
    it('should allow anyone to read approved reviews', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('reviews').doc('rev1').set({ status: 'approved' });
      });
      await assertSucceeds(unauthDb.collection('reviews').doc('rev1').get());
    });

    it('should prevent unauthenticated reading of pending reviews', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('reviews').doc('rev2').set({ status: 'pending' });
      });
      await assertFails(unauthDb.collection('reviews').doc('rev2').get());
    });

    it('should allow users to create reviews with their own userId', async () => {
      const aliceDb = testEnv.authenticatedContext('alice').firestore();
      await assertSucceeds(aliceDb.collection('reviews').doc('rev3').set({ userId: 'alice', rating: 5 }));
    });
  });

  describe('Blog', () => {
    it('should allow anyone to read published blog posts', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('blog').doc('post1').set({ status: 'published' });
      });
      await assertSucceeds(unauthDb.collection('blog').doc('post1').get());
    });

    it('should allow admin to write blog posts', async () => {
      const adminDb = testEnv.authenticatedContext('admin', { admin: true }).firestore();
      await assertSucceeds(adminDb.collection('blog').doc('post2').set({ title: 'New Post' }));
    });
  });

});
