import {
  annotate, Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';
import { IHostListeners } from './hostListener';

export interface DirectiveOptionsDecorated extends ng.IDirective {
  selector: string;
}

export interface DirectiveControllerConstructor {
  new(...args: any[]): DirectiveController;
}

export interface DirectiveController {
  compile?: ng.IDirectiveCompileFn;
  link?: ng.IDirectiveLinkFn | ng.IDirectivePrePost;
  [p: string]: any;
}

export function Directive({selector, ...options}: DirectiveOptionsDecorated) {
  return (ctrl: DirectiveControllerConstructor) => {
    const bindings = getMetadata(metadataKeys.bindings, ctrl);
    if (bindings) {
      options.bindToController = bindings;
    }
    options.restrict = options.restrict || 'A';
    if (options.restrict !== 'A') {
      console.warn(`Consider removing restrict option from ${selector} directive and using it only as
       attribute directive.`);
    }
    if (options.link || options.compile) {
      console.warn(`Consider refactoring ${selector} directive using controller class.`);
    }
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
  const {compile, link} = ctrl.prototype;
  const legacy = compile && typeof compile === 'function' || link && typeof link === 'function';
  if (legacy) {
    directiveFunc =  (...args: any[]) => {
      const injector = args[0]; // reference to $injector
      const instance = injector.instantiate(ctrl);
      if (compile) {
        options.compile = compile.bind(instance);
      }
      else if (link) {
        options.link = link.bind(instance);
      }
      return options;
    };
    directiveFunc.$inject = ['$injector', ...(ctrl.$inject || annotate(ctrl))];
  }
  else {
    options.controller = ctrl;
    ctrl.$inject = ctrl.$inject || annotate(ctrl);
    const listeners: IHostListeners = getMetadata(metadataKeys.listeners, ctrl);
    if (listeners) {
      options.controller = extendWithHostListeners(ctrl, listeners);
    }
    directiveFunc = () => options;
  }
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
