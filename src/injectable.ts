import { annotate, defineMetadata, getMetadata, metadataKeys } from './utils';

export interface ClassProvider {
  provide: string;
  useClass: ng.Injectable<Function>;
}

export interface FactoryProvider {
  provide: string;
  useFactory: any;
  deps?: any[];
}

export interface ValueProvider {
  provide: string;
  useValue: any;
}

export type ProviderObject = ClassProvider | FactoryProvider | ValueProvider;

export function Injectable(name?: string) {
  return (Class: any) => {
    if (!name) {
      console.warn('You are not providing explicit service name, ' +
        'be careful this code might not work as expected when minified.');
      name = Class.name;
    }
    defineMetadata(metadataKeys.name, name, Class);
  };
}

/** @internal */
export function registerProviders(module: ng.IModule,
                                  providers: Array<ng.IServiceProvider | ng.Injectable<Function> | ProviderObject>) {
  providers.forEach((provider: any) => {
    // providers registered using { provide, useClass/useFactory/useValue } syntax
    if (provider.provide) {
      const name = provider.provide;
      if (provider.useClass && provider.useClass instanceof Function) {
        provider.useClass.$inject = provider.useClass.$inject || annotate(provider.useClass);
        if (provider.useClass.prototype.$get) {
          module.provider(name, provider.useClass);
        }
        else {
          module.service(name, provider.useClass);
        }
      }
      else if (provider.useFactory && provider.useFactory instanceof Function) {
        provider.useFactory.$inject = provider.useFactory.$inject || annotate(provider.useFactory);
        module.factory(name, provider.useFactory);
      }
      else if (provider.useValue) {
        module.constant(name, provider.useValue);
      }
    }
    // providers registered as classes
    else {
      const name = getMetadata(metadataKeys.name, provider)
      provider.$inject = provider.$inject || annotate(provider);
      if (provider.prototype.$get) {
        module.provider(name, provider);
      }
      else {
        module.service(name, provider);
      }
    }
  });
}
