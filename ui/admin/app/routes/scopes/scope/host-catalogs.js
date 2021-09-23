import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import loading from 'ember-loading/decorator';
import { confirm } from 'core/decorators/confirm';
import { notifySuccess, notifyError } from 'core/decorators/notify';
import { A } from '@ember/array';

export default class ScopesScopeHostCatalogsRoute extends Route {
  // =services

  @service intl;
  @service notify;
  @service session;
  @service can;
  @service store;
  // =methods

  queryParams = {
    type: {
      refreshModel: true,
    }
  };
  // selectedGroupsIds = A();
  /**
   * If arriving here unauthenticated, redirect to index for further processing.
   */
  beforeModel() {
    if (!this.session.isAuthenticated) this.transitionTo('index');
  }

  /**
   * Loads all host catalogs under the current scope.
   * @return {Promise{[HostCatalogModel]}}
   */
  async model(params) {
    const scope = this.modelFor('scopes.scope');
    const { id: scope_id } = scope;
    if (
      this.can.can('list collection', scope, { collection: 'host-catalogs' })
    ) {
      if(params.type) {
        return this.store.filter('host-catalog', scope_id, {
          name: [params.name]
        });
      }
      else {
        return this.store.query('host-catalog', {
          scope_id,
        });
      }    }
  }

  // =actions

  /**
   * Rollback changes on host catalog.
   * @param {HostCatalogModel} hostCatalog
   */
  @action
  cancel(hostCatalog) {
    const { isNew } = hostCatalog;
    hostCatalog.rollbackAttributes();
    if (isNew) this.transitionTo('scopes.scope.host-catalogs');
  }

  /**
   * Handle save.
   * @param {HostCatalogModel} hostCatalog
   * @param {Event} e
   */
  @action
  @loading
  @notifyError(({ message }) => message)
  @notifySuccess(({ isNew }) =>
    isNew ? 'notifications.create-success' : 'notifications.save-success'
  )
  async save(hostCatalog) {
    await hostCatalog.save();
    await this.transitionTo(
      'scopes.scope.host-catalogs.host-catalog',
      hostCatalog
    );
    this.refresh();
  }

  /**
   * Deletes the host catalog and redirects to index.
   * @param {HostCatalogModel} hostCatalog
   */
  @action
  @loading
  @confirm('questions.delete-confirm')
  @notifyError(({ message }) => message, { catch: true })
  @notifySuccess('notifications.delete-success')
  async delete(hostCatalog) {
    await hostCatalog.destroyRecord();
    await this.replaceWith('scopes.scope.host-catalogs');
    this.refresh();
  }

  @action
  @loading
  async filterHostCatalogs(hostCatalog) {
    //for multi select
    //  if (!this.selectedGroupsIds.includes(group)) {
    //   this.selectedGroupsIds.addObject(group);
    
    // } else {
    //   this.selectedGroupsIds.removeObject(group);
    // }
    await this.transitionTo('scopes.scope.host-catalogs', {
      queryParams: { type: hostCatalog },
    });
  }

  @action
  @loading
  async search(text) { 
     await this.transitionTo('scopes.scope.host-catalogs', {
      queryParams: { name: text },
    });
  }
}
