Chain = new Class({
    LIST: [],

    defaults: {
        async: false,
        lastInFirstOut: false,
        onFinish: function () { },
        onComplete: function () { }
    },

    construct: function () {

    },

    add: function (fn) {
        if (!$istype(fn, 'function')) {
            throw new Error('O metodo suporta apenas funções');
            return;
        }

        such.LIST.push({
            fn: fn,
            executed: false,
            complete: false
        });
    },

    run: function () {
        if (such.LIST.length <= 0)
            return;

        if (such.options.lastInFirstOut)
            such.LIST = such.LIST.reverse();

        if (such.options.async) {
            such.asyncExecute();
        } else {
            such.syncExecute();
        }
    },

    asyncExecute: function () {
        function execute(i) {
            such.execute(i, function () {
                if (!such.hasLastComplete())
                    execute(++i);
            });
        };

        execute(0);
    },

    syncExecute: function () {
        $foreach(such.LIST, function (obj, i) {
            such.execute(i, function () {
                such.hasLastComplete();
            });
        });
    },

    execute: function (id, callback) {
        if (!such.LIST[id])
            return;

        such.LIST[id].executed = true;
        such.LIST[id].fn.apply(such.LIST[id].fn, [function () {
            such.onComplete(id);

            if (callback)
                callback();
        }, id])
    },

    onComplete: function (id) {
        if (!such.LIST[id] || !such.LIST[id].executed)
            return;

        such.LIST[id].complete = true;

        return such.options.onComplete(id);
    },

    hasLastComplete: function () {
        var finish = true;

        $foreach(such.LIST, function (obj, i) {
            finish = finish && obj.complete;
        });

        if (finish)
            such.onFinish();

        return finish;
    },

    onFinish: function () {
        return such.options.onFinish();
    }
});