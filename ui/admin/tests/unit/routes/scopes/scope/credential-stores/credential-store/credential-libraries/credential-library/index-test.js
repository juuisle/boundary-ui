import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Route | scopes/scope/credential-stores/credential-store/credential-libraries/credential-library/index',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      let route = this.owner.lookup(
        'route:scopes/scope/credential-stores/credential-store/credential-libraries/credential-library/index'
      );
      assert.ok(route);
    });
  }
);
