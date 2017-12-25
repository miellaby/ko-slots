if (ko.isObservableArray === undefined) {
    ko.isObservableArray = function(instance) {
        return typeof instance["remove"] === "function" &&
            typeof instance["removeAll"] === "function" &&
            typeof instance["destroy"] === "function" &&
            typeof instance["destroyAll"] === "function" &&
            typeof instance["indexOf"] === "function" &&
            typeof instance["replace"] === "function";
    };
}


function arraySlotsExtender(target, options) {
    options = options || {
        key: null
    };
    var items;
    if (ko.isObservableArray(target))
        items = target;
    else if (ko.isObservable(target))
        items = target.extend({
            trackArrayChanges: true
        });
    else
        items = ko.observableArray(target);

    var defaultPush = items.push.bind(items);
    var defaultRemove = items.remove.bind(items);
    var map = {};
    var slots = {};
    var key; // fn
    if (options.key === null) {
        var key = function(item) {
            return item
        };
    } else if (typeof options.key === "function") {
        var key = options.key;
    } else {
        var key = function(item) {
            return ko.unwrap(item[options.key]);
        }
    }

    function push(item) {
        var k = key(item);
        if (!(k in map)) {
            defaultPush(item);
        } else {
            items.replace(get(k), item);
        }
    }

    function removeKey(k) {
        return k in map ? defaultRemove(get(k)) : [];
    }

    function containsKey(k) {
        return (k in map);
    }

    function contains(item) {
        return (key(item) in map);
    }

    function remove(item) {
        return (typeof item === "function" || key(item) in map) ? defaultRemove(item) : [];
    }

    function get(k) {
        return map[k];
    }

    function slot(k, defaultValue, options) {
        var s = slots[k];
        if (s === undefined) {
            s = ko.observable(k in map ? map[k] : defaultValue);
            s.defaultValue = defaultValue;
            slots[k] = s;
            if (!(options !== undefined && options.pure !== undefined && !options.pure)) {
                var ss = s.subscribe(function() {
                    ss.dispose();
                    delete slots[k];
                }, "asleep");
            }
        }
        return s;
    }

    items.subscribe(function(changesList) {
        changesList.forEach(function(change) {
            var item = change.value;
            var s, k = key(item);
            if (change.status === 'added') {
                map[k] = item;
                (s = slots[k]) !== undefined && s(item);
            } else {
                delete map[k];
                (s = slots[k]) !== undefined && s(s.defaultValue);
            }
        });

    }, items, 'arrayChange');

    items().forEach(function(item) {
        map[key(item)] = item;
    });

    items.idMap = map;
    items.key = key;
    items.containsKey = containsKey;
    items.removeKey = removeKey;
    items.contains = contains;
    items.push = push;
    items.add = push;
    items.remove = remove;
    items.get = get;
    items.slot = slot;
    return items;
};

function slotExtender(target, options) {
    var slots = {};

    function slot(value) {
        var s = slots[value];

        if (s === undefined) {
            s = ko.observable(target.peek() === value);
            slots[value] = s;

            if (!(options !== undefined && options.pure !== undefined && !options.pure)) {
                var ss = s.subscribe(function() {
                    ss.dispose();
                    delete slots[value];
                }, "asleep");
            }
        }
        return s;
    }


    var currentValue = target();
    target.subscribe(function(value) {
        if (value === currentValue)
            return;
        var s;
        (s = slots[currentValue]) !== undefined && s(false);
        (s = slots[value]) !== undefined && s(true);
        currentValue = value;
    });

    target.slot = slot;
    return target;
};

ko.observableCollection = function(array, options) {
    return arraySlotsExtender(array, options);
};

ko.extenders.slots = function(target, options) {
    return (ko.isObservableArray(target) ? arraySlotsExtender(target) : slotExtender(target));
};
