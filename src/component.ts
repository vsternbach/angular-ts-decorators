import {
  Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';
import { IHostListeners } from './hostListener';
import { LifecycleHooks, ngLifecycleHooksMap } from './lifecycle_hooks';

export interface ComponentOptionsDecorated extends ng.IComponentOptions {
  selector: string;
  restrict?: string;
  replace?: boolean;
}

export function Component({selector, ...options}: ComponentOptionsDecorated) {
  return (ctrl: ng.IControllerConstructor) => {
    options.controller = ctrl;
    const isAttrSelector = isAttributeSelector(selector);
    const bindings = getMetadata(metadataKeys.bindings, ctrl);
    if (bindings) {
      if (isAttrSelector) {
        options['bindToController'] = bindings;
        options['controllerAs'] = options['controllerAs'] || '$ctrl';
      }
      else options['bindings'] = bindings;
    }

    if (isAttrSelector) {
      (options as ng.IDirective).restrict = 'A';
    }

    replaceLifecycleHooks(ctrl);

    const selectorName = isAttrSelector ? getAttributeName(selector) : selector;
    defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
    defineMetadata(metadataKeys.declaration, isAttrSelector ? Declarations.directive : Declarations.component, ctrl);
    defineMetadata(metadataKeys.options, options, ctrl);
  };
}

/** @internal */
export function registerComponent(module: ng.IModule, component: ng.IComponentController) {
  const name = getMetadata(metadataKeys.name, component);
  const options = getMetadata(metadataKeys.options, component);
  const listeners: IHostListeners = getMetadata(metadataKeys.listeners, options.controller);
  if (listeners) {
    options.controller = extendWithHostListeners(options.controller, listeners);
  }
  module.component(name, options);
}

/** @internal */
function extendWithHostListeners(ctrl: {new(...args: any[])}, listeners: IHostListeners) {
  const handlers = Object.keys(listeners);

  class NewCtrl extends ctrl {
    constructor(private $element, ...args: any[]) {
      super(...args);
    }
    $postLink() {
      if (super.$postLink) {
        super.$postLink();
      }
      handlers.forEach(handler => {
        const { eventName } = listeners[handler];
        this.$element.on(eventName, this[handler].bind(this));
      });
    }
    $onDestroy() {
      if (super.$onDestroy) {
        super.$onDestroy();
      }
      handlers.forEach(handler => {
        const { eventName } = listeners[handler];
        this.$element.off(eventName, this[handler]);
      });
    }
  }
  NewCtrl.$inject = ['$element', ...ctrl.$inject || []];
  return NewCtrl;
}

/** @internal */
function replaceLifecycleHooks(ctrl: ng.IControllerConstructor) {
  const ctrlClass = ctrl.prototype;
  Object.keys(ctrlClass).forEach(key => {
    const hook = key.substr(2);
    if (LifecycleHooks[hook] >= 0) {
      ctrlClass[ngLifecycleHooksMap[LifecycleHooks[hook]]] = ctrlClass[key];
      delete ctrlClass[key];
    }
  });
}
