import {
  Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';
import { IHostListeners } from './hostListener';
import { LifecycleHooks, ngLifecycleHooksMap } from './lifecycle_hooks';
import { extendWithHostListeners } from './directive';

export interface ComponentOptionsDecorated extends ng.IComponentOptions {
  selector: string;
  styles?: any[];
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
