# angular-ts-decorators

[![Build Status](https://travis-ci.org/vsternbach/angular-ts-decorators.svg?branch=master)](https://travis-ci.org/vsternbach/angular-ts-decorators)
[![dependencies Status](https://david-dm.org/vsternbach/angular-ts-decorators/status.svg)](https://david-dm.org/vsternbach/angular-ts-decorators)
[![bitHound Overall Score](https://www.bithound.io/github/vsternbach/angular-ts-decorators/badges/score.svg)](https://www.bithound.io/github/vsternbach/angular-ts-decorators)

[![NPM](https://nodei.co/npm/angular-ts-decorators.png?downloads=true)](https://nodei.co/npm/angular-ts-decorators/)

A collection of angular 2 style decorators for angularjs 1.5.x projects written in typescript.

See example of usage [here](https://github.com/vsternbach/tasks-playground)

## Prerequisites
`angular-ts-decorators` tries to mimic [angular 2 style](https://angular.io/docs/ts/latest/guide/style-guide.html) decorators as closely as possible.

Some of the decorator interfaces (@Component and @Directive) were heavily inspired by this excellent [Angular 1.x styleguide (ES2015)](https://github.com/toddmotto/angular-styleguide).

> Behind the scenes it uses [Metadata Reflection API](https://www.npmjs.com/package/reflect-metadata) to add metadata to the classes.

## Installation

`npm i --save-dev angular-ts-decorators`

Dependencies: `angular` and `reflect-metadata`
> I assume you're using this package for angular project written in typescript and using some kind of bundler
like Webpack or SystemJS, so no need to worry about the dependencies then, they'll be resolved automatically by your module loader,
otherwise you need to provide `reflect-metadata` shim by yourself. 

## Available decorators

| Decorator     | Angular analog                            | Details   |
|:------------- |:------------------------------------------|:----------|
| @NgModule     | angular.module                            |   |
| @Injectable   | angular.service / angular.provider        | registers as provider if decorated class implements $get method   |
| @Component    | angular.component                         |   |
| @Input        | angular.component options binding ('<')  | can be used only inside @Component decorator <br> default input binding value can be overridden by passing parameter to the decorator |
| @Output       | angular.component options binding ('&')  | can be used only inside @Component decorator |
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
export class TodoFormComponent {
    @Input() todo;
    @Output() onAddTodo;
    
    $onChanges(changes) {
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

Here's an example of provider using @Injectable decorator
```js
/* ----- greeting/greeting.service.ts ----- */
import { Injectable } from 'angular-ts-decorators';

export interface IGreetingService {
  getGreeting(): string;
}

@Injectable()
export class GreetingService implements ng.IServiceProvider {
  private greeting = 'Hello World!';

  // Configuration function
  public setGreeting(greeting: string) {
    this.greeting = greeting;
  }

  // Provider's factory function
  public $get(): IGreetingService {
    return {
      getGreeting: () => { return this.greeting; }
    };
  }
}
```

Providers can be registered using Angular 2 syntax. Elements of the array can be a class or provider object. The provider object has a ```provide``` property (string token), and a ```useClass```, ```useFactory```, or ```useValue``` property to use as the provided value.

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
And here's an example of provider registration with @NgModule decorator, its configuration in config method of module class and it's usage in run method:
```js
import { NgModule } from 'angular-ts-decorators';
import { TodoFormModule } from 'todo/todo-form/todo-form.module';
import { GreetingService, IGreetingService } from 'greeting/greeting.service';
import { UppercasePipe } from 'greeting/uppercase.filter';

@NgModule({
  imports: [
    TodoFormModule
  ],
  declarations: [UppercasePipe],
  providers: [
      GreetingService,
      {provide: GreetingService.name, useClass: GreetingService},
      {provide: GreetingService.name, useFactory: () => new GreetingService()},
      {provide: 'Greeter', useValue: new GreetingService()},
  ]
})
export class AppModule {
  public config(GreetingServiceProvider: GreetingService) {
    GreetingServiceProvider.setGreeting('Hello decorated provider');
  }

  public run(GreetingService: IGreetingService) {
    console.log(GreetingService.getGreeting());
  }
}
```
>Please notice, that you can't define constructor and $inject 
 anything into it, instead specify all of the injections you 
 want to provide to your module config and run blocks as arguments of config 
 and run methods of the module class and they'll be injected by their names.
 
 ## Contributing
 
 
 Fork project, download source and run tests:
 ```
 git clone git@github.com:<your-github>/angular-ts-decorators.git
 cd angular-ts-decorators
 npm install
 npm test
 ```
