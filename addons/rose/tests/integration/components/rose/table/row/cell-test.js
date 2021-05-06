import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rose/table/row/cell', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(2);
    await render(hbs`<Rose::Table::Row::Cell>
      content
    </Rose::Table::Row::Cell>`);
    assert.ok(find('td'));
    assert.equal(find('.rose-table-cell').textContent.trim(), 'content');
  });

  test('it renders with attributes', async function (assert) {
    assert.expect(1);
    await render(hbs`<Rose::Table::Row::Cell id="cell"/>`);
    assert.ok(find('#cell'));
  });

  test('it renders as header cell', async function (assert) {
    assert.expect(4);
    await render(hbs`<Rose::Table::Row::Cell @tagName='th'/>`);
    assert.ok(find('th'));
    assert.ok(find('.rose-table-header-cell'));
    assert.notOk(find('td'));
    assert.notOk(find('.rose-table-cell'));
  });

  test('it adds a style class', async function (assert) {
    assert.expect(1);
    await render(hbs`<Rose::Table::Row::Cell @style='expand' />`);
    assert.ok(find('.rose-table-cell-expand'));
  });
});
