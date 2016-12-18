# angular-decorated
A collection of angular 2 style decorators for angularjs 1.5.x projects written in typescript

## Prerequisites
`angular-decorated` tries to mimic [angular 2 style](https://angular.io/docs/ts/latest/guide/style-guide.html) decorators as closely as possible.

Some of the decorator interfaces (@Component and @Directive) were heavily inspired by this excellent [Angular 1.x styleguide (ES2015)](https://github.com/toddmotto/angular-styleguide) by Todd Motto.

> Behind the scenes it uses [Metadata Reflection API](https://www.npmjs.com/package/reflect-metadata) to add metadata to the classes.

## Installation

`npm i --save-dev angular-decorated`

Dependencies: `angular` and `reflect-metadata`
> I assume you're using this package for angular project written in typescript and using some kind of bundler
like Webpack or SystemJS, so no need to worry about the dependencies then, they'll be resolved automatically by your module loader,
otherwise you need to provide `reflect-metadata` shim by yourself. 

## Usage

##### Introduction to @Component and @NgModule
Let's say we have a todo-form component from classical todo example with the following template
```html
/* ----- todo/todo-form/todo-form.html ----- */
<form name="todoForm" ng-submit="$ctrl.onSubmit();">
  <input type="text" ng-model="$ctrl.todo.title">
  <button type="submit">Submit</button>
</form>
```
If we were writing in plain es6/typescript without decorators we'd define this component like this:
```typescript
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
```typescript
import angular from 'angular';
import { TodoFormComponent } from './todo-form.component';

export const TodoFormModule = angular
  .module('todo.form', [])
  .component('todoForm', TodoFormComponent)
  .name;
```

Using `angular-decorated` decorators in typescript the component code will look like this
```typescript
/* ----- todo/todo-form/todo-form.component.ts ----- */
import { Component, Input, Output } from 'angular-decorated';

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
And we'll register it with angular like so:
```typescript
/* ----- todo/todo-form/todo-form.module.ts ----- */
import { NgModule } from 'angular-decorated';
import { TodoFormComponent } from './todo-form.component';

@NgModule({
  declarations: [TodoFormComponent]
})
export class TodoFormModule {}
```

To be continued..