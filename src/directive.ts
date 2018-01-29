import {
  Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';
import { IHostListeners } from './hostListener';
import { extendWithHostListeners, replaceLifecycleHooks } from './component';
import { IController, IDirective, IModule } from 'angular';

export interface DirectiveOptionsDecorated extends IDirective {
  selector: string;
}

export interface DirectiveControllerConstructor {
  new (...args: any[]): IController;
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
export function registerDirective(module: IModule, ctrl: DirectiveControllerConstructor) {
  let directiveFunc;
  const name = getMetadata(metadataKeys.name, ctrl);
  const options = getMetadata(metadataKeys.options, ctrl);
  replaceLifecycleHooks(ctrl);
  const listeners: IHostListeners = getMetadata(metadataKeys.listeners, ctrl);
  options.controller = listeners ? extendWithHostListeners(ctrl, listeners) : ctrl;
  directiveFunc = () => options;
  module.directive(name, directiveFunc);
}
