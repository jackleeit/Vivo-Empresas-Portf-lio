Loader = new Class({

}, {
    /*
    * @member Loader
    * @method [static] js
    * @param {string} url
    * @param {function} success ?
    * @param {function} error ?
    * @param {boolean} sync ?
    * @return {boolean} status
    * @description Carrega um arquivo javascript e adiciona na página
    */
    js: function (url, callback, error, sync) {
        callback = callback || function () { };
        error = error || function () { };

        var obj = null;
        obj = document.createElement('script');

        obj.name = name;
        obj.type = 'text/javascript';
        obj.async = !sync;
        obj.runat = true;

        try {
            obj.onload = obj.onreadystatechange = function () {
                if (this.runat && (!this.readyState || this.readyState === 'complete' || (this.readyState === 'loaded'))) { //&& this.nextSibling != null
                    this.runat = false;
                    callback.apply(obj, []);
                    this.onload = this.onreadystatechange = null;
                }
                else
                    if (this.readyState === 'loaded' && this.nextSibling == null) {
                        error.apply(obj, []);
                    }
            }

            obj.onerror = function () {
                error.apply(obj, []);
            }

            obj.src = url;
            document.getElementsByTagName('head')[0].appendChild(obj); // Adds element

        }
        catch (e) {
            throw new ('javascript loader error');
            return false;
        }


        return obj;

    },
    /*
    * @member Loader
    * @method [static] css
    * @param {string} url
    * @param {function} success ?
    * @param {function} error ?
    * @return {boolean} status
    * @description Carrega um arquivo css e adiciona na página
    */
    css: function (url, callback, error) {
        callback = callback || function () { };
        error = error || function () { };

        var obj = document.createElement('link');
        obj.rel = 'stylesheet';
        obj.id = name;
        obj.name = name;
        obj.type = 'text/css';

        try {

            obj.addEvent('error', error);

            obj.href = url;

            document.getElementsByTagName('head')[0].appendChild(obj);

            if (callback)
                callback.apply(obj, []);

            return true;
        }
        catch (e) {
            throw new ('css loader error');
            return false;
        }
    },

    img: function (url, callback, error) {
        callback = callback || function () { };
        error = error || function () { };

        try {
            var img = new Image();
            Element.prototype.addEvent.apply(img, ['load', callback]);
            Element.prototype.addEvent.apply(img, ['error', error]);

            img.src = url;

            return img;
        }
        catch (e) {
            throw new ('img loader error');
            return false;
        }
    }
});