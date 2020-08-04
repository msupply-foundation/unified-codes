import { Slot } from '@wry/context';
import { dep } from 'optimism';

var varDep = dep();
var cacheSlot = new Slot();
function makeVar(value) {
    var caches = new Set();
    return function rv(newValue) {
        if (arguments.length > 0) {
            if (value !== newValue) {
                value = newValue;
                varDep.dirty(rv);
                caches.forEach(broadcast);
            }
        }
        else {
            var cache = cacheSlot.getValue();
            if (cache)
                caches.add(cache);
            varDep(rv);
        }
        return value;
    };
}
function broadcast(cache) {
    if (cache.broadcastWatches) {
        cache.broadcastWatches();
    }
}

export { cacheSlot, makeVar };
//# sourceMappingURL=reactiveVars.js.map
