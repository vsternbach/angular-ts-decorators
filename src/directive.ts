import {
  annotate, Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';
import { IHostListeners } from './hostListener';
import { replaceLifecycleHooks } from './component';

export interface DirectiveOptionsDecorated extends ng.IDirective {
  selector: string;
}

export interface DirectiveControllerConstructor {
  new (...args: any[]): ng.IController;
}

export function Directive({selector, ...options}: DirectiveOptionsDecorated) {
  return (ctrl: DirectiveControllerConstructor) => {
    const bindings = getMetadata(metadataKeys.bindings, ctrl);
    if (bindings) {
      options.bindToController = bindings;
    }
    options.restrict = options.restrict || 'A';

    const selectorName = isAttributeSelector(selector) ? getAttributeName(selector) : selector;
    defineMetadata(metadataKeys.name, kebabToCamel(selectorName), ctrl);
    defineMetadata(metadataKeys.declaration, Declarations.directive, ctrl);
    defineMetadata(metadataKeys.options, options, ctrl);
  };
}

/** @internal */
export function registerDirective(module: ng.IModule, ctrl: DirectiveControllerConstructor) {
  let directiveFunc;
  const name = getMetadata(metadataKeys.name, ctrl);
  const options = getMetadata(metadataKeys.options, ctrl);
  ctrl.$inject = ctrl.$inject || annotate(ctrl);
  replaceLifecycleHooks(ctrl);
  const listeners: IHostListeners = getMetadata(metadataKeys.listeners, ctrl);
  options.controller = listeners ? extendWithHostListeners(ctrl, listeners) : ctrl;
  directiveFunc = () => options;
  module.directive(name, directiveFunc);
}

/** @internal */
export function extendWithHostListeners(ctrl: {new(...args: any[])}, listeners: IHostListeners) {
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
