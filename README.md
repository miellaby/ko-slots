# ko-slots
a [knockout](http://knockoutjs.com) extender to check the content of an observable in a much more scalable way

See https://jsfiddle.net/miellaby/12a649j5/


# Introduction
The _slot_ extender adds the _slot()_ method to a Knockout _observable_ or _observableArray_.

_slot()_ returns a self-disposed subscribable which tells if the target is/contains something.

Slots are value-indexed so that only the impacted slots fire an update when the target changes.
It leads to a better binding efficiency on huge and highly dynamic models.

##  ObservableArray Slots Usage Examples
### key-indexed slots
Such slots may help access an object in a secondary collection from the view of a main collection.
```
var enhancedArray = ko.observableArray([{id: 1, title: "ya!"}, {id: 2, title: "hoo!" }])
                      .extend({ slot: { key: 'id' } });
```
...
```
<span data-bind="text: enhancedArray.slot($data.foreignKey, {title: 'undefined'}).title"></span>
```

### value-indexed slots
Such slots may help check the existence of an object in a secondary collection.
```
var enhancedArray = ko.observableArray([{id: 1, title: "ya!"}, {id: 2, title: "hoo!" }]).extend({ slot: {} });
```
...
```
<span data-bind="css: { 'selected': enhancedArray.slot($data) }"></span>
```

## Non-Array Observable Slots
Non-Array Slots may help to compare two observables one to each other, as in:
```
var enhancedObservable = ko.observable().extend({ slot: {} });
```
...
````
<span data-bind="css: {'selected': $root.enhancedObservable.slot($data)}"></span>
```

# About the demo
Reminder: https://jsfiddle.net/miellaby/12a649j5/
This demo illustrates the use of the "slot" prototype extender for Knockout.js.
