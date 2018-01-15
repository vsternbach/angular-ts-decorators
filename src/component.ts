import {
  Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';
import { IHostListeners } from './hostListener';
import { ngLifecycleHooksMap } from './lifecycle_hooks';
import { isFunction, IControllerConstructor, IDirective, IModule, IComponentController,
  IComponentOptions } from 'angular';

export interface ComponentOptionsDecorated extends IComponentOptions {
  selector: string;
  styles?: any[];
  restrict?: string;
  replace?: boolean;
}

export function Component({selector, ...options}: ComponentOptionsDecorated) {
  return (ctrl: IControllerConstructor) => {
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
      (options as IDirective).restrict = 'A';
    }

    replaceLifecycleHooks(ctrl);

    const selectorName = isAttrSelector ? getAttributeName(selector) : selector;
    defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
    defineMetadata(metadataKeys.declaration, isAttrSelector ? Declarations.directive : Declarations.component, ctrl);
    defineMetadata(metadataKeys.options, options, ctrl);
  };
}

/** @internal */
export function registerComponent(module: IModule, component: IComponentController) {
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
export function replaceLifecycleHooks(ctrl: IControllerConstructor) {
  const ctrlClass = ctrl.prototype;
  const ngHooksFound: string[] = getHooksOnCtrlClass(ctrlClass);

  ngHooksFound.forEach((ngHook: string) => {
    const angularJsHook: string = ngLifecycleHooksMap[ngHook];

    ctrlClass[angularJsHook] = ctrlClass[ngHook];

    delete ctrlClass[ngHook];
  });
}

/** @internal */
function getHooksOnCtrlClass(ctrlClass: any): string[] {
  return Object.keys(ngLifecycleHooksMap)
    .filter((hook: string) => isFunction(ctrlClass[hook]));
}
