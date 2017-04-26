import {
  Declarations, defineMetadata, getAttributeName, getMetadata, isAttributeSelector, kebabToCamel,
  metadataKeys
} from './utils';

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
  module.component(name, options);
}
