import { annotate, Declarations, defineMetadata, getMetadata, metadataKeys } from './utils';
export interface PipeTransformConstructor {
  new(...args: any[]): PipeTransform;
}

export interface PipeTransform {
  transform(...args: any[]): any;
}

export function Pipe(options: {name: string}) {
  return (Class: PipeTransformConstructor) => {
    defineMetadata(metadataKeys.name, options.name, Class);
    defineMetadata(metadataKeys.declaration, Declarations.pipe, Class);
  };
}

/** @internal */
export function registerPipe(module: ng.IModule, filter: PipeTransformConstructor) {
  const name = getMetadata(metadataKeys.name, filter);
  const filterFactory = (...args: any[]) => {
    const injector = args[0]; // reference to $injector
    const instance = injector.instantiate(filter);
    return instance.transform.bind(instance);
  };
  filterFactory.$inject = ['$injector', ...(filter.$inject || annotate(filter))];
  module.filter(name, filterFactory);
}
