# ko-slots
a [knockout](http://knockoutjs.com) extender to check the content of an observable in a much more scalable way

See https://jsfiddle.net/miellaby/12a649j5/


# Introduction
The _slot_ extender adds the _slot()_ method to a knockout _observable_ or _observableArray_.

_slot()_ returns a self-disposed subscribable which tells if the target is/contains something.

Slots are value-indexed so that when the target changes, only the impacted slots fire an update. It leads to a much higher binding efficiency while dealing with a huge and highly dynamic model.

##  ObservableArray Slots
```
var enhancedArray = ko.observableArray({id: 1, title: "ya!"}, {id: 2, title: "hoo!" }).extend({ slot: { key: 'id' } });
```

Such slots may help to refer an object from a foreign collection in the view of a main object, as in: `data-bind="text: enhancedArray.slot($data.foreignKey, {title: 'undefined'}).title"`

## Non-Array Observable Slots
```
var enhancedObservable = ko.observable().extend({ slot: {} });
```

Non-Array Slots may help to compare two observables one to each other, as in: `data-bind="css: {'userSelected': $root.userSelection.slot($data)}"`

# About the demo
Reminder: https://jsfiddle.net/miellaby/12a649j5/

This absurd demo illustrates how to use the "slot" prototype extender with Knockout so to get a much less laggy application with a huge moving model.
