# angular-ts-decorators

A collection of angular 2 style decorators for angularjs 1.5.x projects written in typescript.

[![Build Status](https://travis-ci.org/vsternbach/angular-ts-decorators.svg?branch=master)](https://travis-ci.org/vsternbach/angular-ts-decorators)
[![Coverage Status](https://coveralls.io/repos/github/vsternbach/angular-ts-decorators/badge.svg?branch=master)](https://coveralls.io/github/vsternbach/angular-ts-decorators?branch=master)
[![dependencies Status](https://david-dm.org/vsternbach/angular-ts-decorators/status.svg)](https://david-dm.org/vsternbach/angular-ts-decorators)
[![bitHound Overall Score](https://www.bithound.io/github/vsternbach/angular-ts-decorators/badges/score.svg)](https://www.bithound.io/github/vsternbach/angular-ts-decorators)

[![NPM](https://nodei.co/npm/angular-ts-decorators.png?downloads=true)](https://nodei.co/npm/angular-ts-decorators/)

See example of usage [here](https://github.com/vsternbach/tasks-playground)

## Prerequisites
`angular-ts-decorators` tries to mimic [angular 2 style](https://angular.io/docs/ts/latest/guide/style-guide.html) decorators as closely as possible.

Some of the decorator interfaces (@Component and @Directive) were heavily inspired by this excellent [Angular 1.x styleguide (ES2015)](https://github.com/toddmotto/angular-styleguide).

> Behind the scenes it uses [Metadata Reflection API](https://www.npmjs.com/package/reflect-metadata) to add metadata to the classes.

## Installation

`npm i -S angular-ts-decorators`

Dependencies: `tslib` and `reflect-metadata`
Peer dependencies: `"angular": ">=1.5.0"`

## Available decorators

| Decorator     | angularjs analog                            | Details   |
|:------------- |:------------------------------------------|:----------|
| @NgModule     | angular.module                            |   |
| @Injectable   | angular.service / angular.provider        | registers as provider if decorated class implements $get method   |
| @Inject       | ---  | see [@Inject](#inject) for details |
| @Component    | angular.component                         |   |
| @Input        | angular.component options binding ('<')  | can be used only inside @Component decorator <br> default input binding value can be overridden by passing parameter to the decorator |
| @Output       | angular.component options binding ('&')  | can be used only inside @Component decorator |
| @HostListener       | ---  | see [@HostListener](#hostlistener) for details |
| @ViewChild(ren)       | ---  | see [@ViewChild](#viewchild) for details |
| @Directive    | angular.directive                         |   |
| @Pipe         | angular.filter                            |   |

## Usage with examples

Let's say we have a todo-form component from classical todo example with the following template
```html
/* ----- todo/todo-form/todo-form.html ----- */
<form name="todoForm" ng-submit="$ctrl.onSubmit();">
  <input type="text" ng-model="$ctrl.todo.title">
  <button type="submit">Submit</button>
</form>
```
If we were writing in plain es6/typescript without decorators we'd define this component like this:
```js
/* ----- todo/todo-form/todo-form.component.js ----- */
const templateUrl = require('./todo-form.html');

export const TodoFormComponent = {
  bindings: {
    todo: '<',
    onAddTodo: '&'
  },
  templateUrl,
  controller: class TodoFormComponent {
    todo;
    onAddTodo;
    
    $onChanges(changes) {
      if (changes.todo) {
        this.todo = Object.assign({}, this.todo);
      }
    }
    onSubmit() {
      if (!this.todo.title) return;
      this.onAddTodo({
        $event: {
          todo: this.todo
        }
      });
    }
  }
};
```
And then we'll register our component with angular like so:
```js
import angular from 'angular';
import { TodoFormComponent } from './todo-form.component';

export const TodoFormModule = angular
  .module('todo.form', [])
  .component('todoForm', TodoFormComponent)
  .name;
```

Using `angular-ts-decorators` decorators in typescript the component code will look like this
```js
/* ----- todo/todo-form/todo-form.component.ts ----- */
import { Component, Input, Output } from 'angular-ts-decorators';

const templateUrl = require('./todo-form.html');

@Component({
  selector: 'todoForm',
  templateUrl
})
export class TodoFormComponent implements OnChanges {
    @Input() todo;
    @Output() onAddTodo;
    
    ngOnChanges(changes) {
      if (changes.todo) {
        this.todo = {...this.todo};
      }
    }
    onSubmit() {
      if (!this.todo.title) return;
      this.onAddTodo({
        $event: {
          todo: this.todo
        }
      });
    }
}
```
> Notice how @Input and @Output decorators replace bindings of the
component, by default @Input correlates to '<' value of the binding
and @Output - to the '&' value, you can override bindings values 
only in @Input decorator by passing '=' or '@' if you need to.

And we'll register it with angular like so:
```js
/* ----- todo/todo-form/todo-form.module.ts ----- */
import { NgModule } from 'angular-ts-decorators';
import { TodoFormComponent } from './todo-form.component';

@NgModule({
  declarations: [TodoFormComponent]
})
export class TodoFormModule {}
```
> You should declare all of the components (@Component), directives (@Directive) and filters (@Pipe) 
you want to register with some module in `declarations` 
of @NgModule decorator, all of the services (@Injectable) and providers (also @Injectable with $get method) you 
should declare as `providers` of @NgModule decorator, and all of the modules your 
module depends on in `imports`. Name of the class decorated 
with @NgModule is the name of the module you should provide in 
`imports` of other module declaration that depends on this module. 
In addition you can define config and run blocks for your module 
by adding config and run methods to your module class  declaration. 

Here's an example of service using @Injectable decorator
```js
/* ----- greeting/greeting.service.ts ----- */
import { Injectable } from 'angular-ts-decorators';

@Injectable()
export class GreetingService {
  private greeting = 'Hello World!';

  // Configuration function
  public setGreeting(greeting: string) {
    this.greeting = greeting;
  }
}
```

Services, factories and constants can be registered using Angular 2 syntax by providing an array of provider objects. The provider object has a ```provide``` property (string token), and a ```useClass```, ```useFactory```, or ```useValue``` property to use as the provided value.

This is how angular filter looks like using angular 2 style @Pipe decorator:
```js
/* ----- greeting/uppercase.filter.ts ----- */
import { Pipe, PipeTransform } from 'angular-ts-decorators';

@Pipe({name: 'uppercase'})
export class UppercasePipe implements PipeTransform {
  public transform(item: string) {
    return item.toUpperCase();
  }
}
```
>Please note, that using @Pipe decorator you can register only stateless filters, for stateful filters you need to fallback to original angularjs filter declaration

And here's an example of provider registration with @NgModule decorator, its configuration in config method of module class and it's usage in run method:
```js
import { NgModule } from 'angular-ts-decorators';
import { TodoFormModule } from 'todo/todo-form/todo-form.module';
import { GreetingService } from 'greeting/greeting.service';
import { UppercasePipe } from 'greeting/uppercase.filter';

@NgModule({
  id: 'AppModule',
  imports: [
    TodoFormModule
  ],
  declarations: [UppercasePipe],
  providers: [
      GreetingService, // you can register this way only if you provide class name to @Injectable decorator
      {provide: 'GreetingService', useClass: GreetingService},
      {provide: 'GreetingServiceFactory', useFactory: () => new GreetingService()}
  ]
})
export class AppModule {
  /*@ngInject*/
  static config($compileProvider: ng.ICompileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }

  /*@ngInject*/
  static run(GreetingService: GreetingService) {
    console.log(GreetingService.getGreeting());
  }
}
```
>Please notice, that you can't define constructor and $inject 
 anything into it, instead specify all of the injections you 
 want to provide to your module config and run blocks as arguments of config 
 and run methods of the module class and they'll be injected by their names.
 
 ## HostListener
 
 @HostListener is a special method decorator introduced in angular 2, see [official docs](https://angular.io/docs/ts/latest/guide/style-guide.html#!#directives)
 >Please notice, that this feature is kind of experimental, because the way it's implemented is kind of hacky: classes that have @HostListener methods are replaced with a new class that extends the original class. It works with basic use cases, but there could be some implications in some edge cases, so be aware.
 
 Usage:
 ```js
 import { HostListener } from 'angular-ts-decorators';
 
 export class MyDirective {
   @HostListener('click mouseover')
   onClick() {
     console.log('click');
   }
 }
 ```
 The implementation of it in angularjs as follows, it injects $element into component constructor and attaches method decorated with @HostListener as event handler on $element in $postLink and dettaches it in $onDestroy:
  ```js
  
  export class MyDirective {
    constructor(private $element: ng.IAugmentedJQuery) {}
    
    $postLink() {
      this.$element.on('click mouseover', this.onClick.bind(this));
    }  
    
    $onDestroy() {
      this.$element.off('click mouseover', this.onClick);
    }
    
    onClick() {
      console.log('click');
    }
  }
  ``` 
  
## ViewChild
 
@ViewChild and @ViewChildren are property decorators introduced in angular 2, see [official docs](https://angular.io/api/core/ViewChild)
 
 Usage is more or less the same as in official docs, but it doesn't support template variables obviously (cause they don't exist in angularjs).
 When provided selector is Component/Directive's type or selector, it's controller class is returned, if other css selector is provided - jqlite object is returned.  

>This feature relies on angularjs debug data, so it won't work for fetching controller classes when `$compileProvider.debugInfoEnabled(false);`

>This decorator uses Array.from, so polyfill must be provided when targeting for older browsers. 

>Please notice, that this feature is kind of experimental, because the way it's implemented is kind of hacky: classes that have @HostListener methods are replaced with a new class that extends the original class. It works with basic use cases, but there could be some implications in some edge cases, so be aware.

 ## Inject
 
@Inject decorator allows to inject providers under a different name, for example if you have a provider like this:
 ```js
@Injectable('My.Service')
export class MyService {}
 ```
You can use it like this:
 ```js
export class MyController {
  constructor(@Inject('My.Service') service: MyService) {}
}
  ```
>Please notice that this decorator relies on explicit annotations either using static $inject property or using tools like ngAnnotate
   
 ## Bootstraping angularjs application the angular way
 
 In angularjs way the manual boostrap would look like this
 ```
angular.element(document).ready(() => {
  angular.bootstrap(document, ['AppModule'], {strictDi: true});
});
 ```
Using `angular-ts-decorators` you can boostrap your application with angular syntax
```
platformBrowserDynamic().bootstrapModule((AppModule as NgModule).module.name);
```
>`strictDi = true` by default, you can override it, passing `{strictDi: false}` as the second argument to bootstrapModule
