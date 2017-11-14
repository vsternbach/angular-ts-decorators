import { annotate, Declarations, defineMetadata, getMetadata, metadataKeys } from './utils';
export interface PipeTransformConstructor {
  new(...args: any[]): PipeTransform;
}

export interface PipeTransform {
  transform(...args: any[]): any;
}

export function Pipe(options: {name: string, stateful: boolean}) {
  return (Class: PipeTransformConstructor) => {
    defineMetadata(metadataKeys.name, options.name, Class);
    defineMetadata(metadataKeys.declaration, Declarations.pipe, Class);
    defineMetadata(metadataKeys.options, options, Class);
  };
}

/** @internal */
export function registerPipe(module: ng.IModule, filter: PipeTransformConstructor) {
  const name = getMetadata(metadataKeys.name, filter);
  const options = getMetadata(metadataKeys.options, filter);
  const filterFactory = (...args: any[]) => {
    const injector = args[0]; // reference to $injector
    const instance = injector.instantiate(filter);
    const transform = instance.transform.bind(instance);
    if (options.stateful) {
      transform.$stateful = options.stateful;
    }
    return transform;
  };
  filterFactory.$inject = ['$injector', ...(filter.$inject || annotate(filter))];
  module.filter(name, filterFactory);
}
