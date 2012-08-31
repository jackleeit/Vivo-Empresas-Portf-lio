/**
 * @alias ControlMenu
 * @author Felipe Pupo Rodrigues, Murilo do Carmo
 * @param ControlMenu({
 * @param startNow @return bolean
 * @param startNow : true, //auto inicializacao, defina false para nao iniciar automaticamente
 * @param container: null, // lugar onde contem varios itens a serem inseridos
 * @param content: false, // local onde adiciona o novo arquivo html etc
 * @param get:'a', // procura get em containers e adiciona nos itens
 * @param actived: null, // o item atual que esta ativo
 * @param method: 'get', // metodo de envio por ajax
 * @param contentUpdate: true,
 * @param cache:true,
 * @param hash:true,
 * @param onStart:function(){}, // ao iniciar execute
 * @param onStartListener:function(){},
 * @param onStopListener:function(){},
 * @param onDestroyListeners:function(){},
 * @param onClick:function(){},  // quando o objeto for clicado execute
 * @param onSuccess:function(){},
 * @param onFailure:function(){},
 * })
 * @classDescription cria 1 ou varios controles de menu (links)
 * @version 2.0
 */
ControlMenu = new Class({
    STARTED: false,
    ITENS: [], //todos os itens dos container
    HISTORY: {},
    ENABLECLICK: true,

    /**
    * iniciando a base da classe ControlMenu
    * é necessario passar os setings basicos
    * @param {Object} st
    */
    construct: function (st) {
        if (such.options.startNow)
            such.start();
    },
    /**
    * inicia o novo menu criado, cria novos parametros dentro
    * dos objetos como retorno.
    * Ex. $('meulinkcriado').hrof = href
    * @return parent, hrof, href, method, content, this.onStart(item);
    */
    start: function () {
        var containers = DOM.get(such.options.container);

        if (containers && containers.length > 0) {
            such.STARTED = true;

            such.ITENS = DOM.get(such.options.get, containers[0]);

            var page = window.location.hash.substr(1);

            if ((such.options.pushstate && window.history['pushState']) && (!page || page == '')) {
                page = window.location.pathname;
            }

            if (page == '' || page == '/' || page == such.options.path) {
                page = such.options.defaultPage;
            }

            for (var i = 0; i < such.ITENS.length; i++) {
                var item = such.ITENS[i];
                item.parent = such;
                item.hrof = item.href.replace(document.location.href, '');
                item.href = "javascript: void(0);";
                item.method = (item.method) ? item.method : such.options.method;
                item.content = (item.target) ? item.target : such.options.content;

                if (item.target)
                    item.removeProperty('target');

                such.startListener(item);

                if (page && item.rel && !such.options.pageActive) {
                    var rels = item.rel.split(',');
                    for (var r = 0; r < rels.length; r++) {
                        if (rels[r] != '' && page.search(rels[r]) != -1) {
                            such.options.pageActive = item;
                        }
                    }
                }
            };

            such.options.onStart.apply(such, []);

            if (such.options.pageActive)
                such.onClick(such.options.pageActive);

            if (such.options.pushstate) {
                window.onpopstate = function (event) {
                    if (event.state) {
                        if (such.HISTORY[event.state]) {
                            such.onClick(such.HISTORY[event.state].element);
                        }
                    }
                };
            }

        }
    },

    /**
    * inicia a observacao no item, adicionando um evento onClick
    * @param {Object} item
    * @return item.active, this.onStartListener(item);
    */
    startListener: function (item) {
        item.active = true;
        item.addEvent('click', function () {
            such.onClick(item);
        });
        such.options.onStartListener.apply(such, [item]);
    },
    /**
    * para o onClick
    * @param {Object} item
    * @return item.active, this.onStopListener(item);
    */
    stopListener: function (item) {
        item.active = false;
        item.removeEvents("onclick");
        such.options.onStopListener.apply(such, [item]);
    },
    /**
    * cancela a observacao do evendo onClick, 
    * carrega conteudo do item.hrof dentro do item.content no metodo item.method
    * adiciona a observacao do onclick no this.actived
    * @param {Object} item
    * @return this.fnOnclick(item);
    */
    onClick: function (element) {
        if (!such.ENABLECLICK)
            return;
        else
            such.ENABLECLICK = false;

        such.stopListener(element);

        var content = DOM.get(element.content)[0];

        if (element.content == '_blank') {
            window.open(element.hrof);
        } else if (element.content.charAt(0) == "_") {
            document[element.content].location = element.hrof;
        } else if (!(element.hrof.search('#') != -1) && content) {
            if (such.options.cache && such.HISTORY[element.hrof]) {
                such.requestUpdate(such.HISTORY[element.hrof]);
                if (such.options.addressUpdate)
                    such.updateAddressBar(such.HISTORY[element.hrof]);
            } else {
                such.loadPage(element, true);
            }
        } else if (such.options.contentUpdate)
            such.requestUpdate(such.HISTORY[element.hrof]);

        if (such.actived)
            such.startListener(such.actived);

        such.options.actived = element;
        such.ENABLECLICK = true;
        such.options.onClick.apply(such, [element]);
    },

    loadPage: function (element, update) {
        if (such.HISTORY[element.hrof])
            return;

        such.HISTORY[element.hrof] = {};

        such.request = such.HISTORY[element.hrof].request = new XHR({
            url: options.tplSrc.strpl({
                href: element.hrof
            }),
            method: element.method,
            onSuccess: function (t, x) {
                such.HISTORY[element.hrof].text = t;
                such.HISTORY[element.hrof].xml = x;
                such.HISTORY[element.hrof].content = DOM.get(element.content)[0];
                such.HISTORY[element.hrof].element = element;
                such.HISTORY[element.hrof].href = element.hrof;

                such.requestSuccess(such.HISTORY[element.hrof]);

                if (update) {
                    if (such.options.contentUpdate)
                        such.requestUpdate(such.HISTORY[element.hrof]);
                    if (such.options.addressUpdate)
                        such.updateAddressBar(such.HISTORY[element.hrof]);
                }
            },
            onFailure: function (x) {
                such.startListener(element);
                such.requestFailure({
                    element: element,
                    error: x
                });
            }
        });
    },

    updateAddressBar: function (obj) {
        var href = obj.href.split('/').reverse()[0];
        var path = window.location.pathname.replace(/[^\/]*$/, '');

        path = path.replace(/\n\t/gim, '');

        var unreal = options.tplAddress.strpl({
            path: path,
            href: href
        });
        
        if (such.options.pushstate && window.history['pushState']) {
            window.history.pushState(obj.href, obj.element.title, unreal);
        } else if (such.options.hash) {
            window.location = '#' + (unreal);
        }

        document.title = obj.element['getAttribute'] ? obj.element.getAttribute('title') : obj.element.title;

    },
    requestSuccess: function (obj) {
        such.options.onSuccess.apply(such, arguments);
    },
    requestUpdate: function (obj) {
        if (obj.content.url != obj.href) {
            obj.content.innerHTML = obj.text;
            obj.content.url = obj.href;
        }
        such.options.onUpdate.apply(such, arguments);
    },
    requestFailure: function (obj) {
        such.options.onFailure.apply(such, arguments);
    },

    destroyListeners: function (item) {
        such.stopListener(item);
        such.actived = null;

        for (var i = 0; i < such.ITENS.length; i++) {
            if (such.ITENS[i] === item)
                delete such.ITENS[i];
        }

        item.href = item.hrof;
        item.parent = null;
        item.hrof = null;
        item.method = null;
        item.content = null;
        item.active = null;

        such.options.onDestroyListeners.apply(such, [item]);
    }
}, {
    defaults: {
        startNow: true, //auto inicializacao, defina false para nao iniciar automaticamente
        container: null, // lugar onde contem varios itens a serem inseridos
        content: false, // local onde adiciona o novo arquivo html etc
        get: 'a', // procura get em containers e adiciona nos itens
        pageActive: null,
        defaultPage: '/',
        actived: null, // o item atual que esta ativo
        method: 'get', // metodo de envio por ajax
        contentUpdate: true,
        addressUpdate: true,
        tplSrc: '{href}',
        tplAddress: '{path}{href}',
        cache: true,
        hash: true,
        pushstate: true,
        path: '',
        onStart: function () { }, // ao iniciar execute
        onStartListener: function () { },
        onStopListener: function () { },
        onDestroyListeners: function () { },
        onClick: function () { },  // quando o objeto for clicado execute
        onUpdate: function () { },
        onSuccess: function () { },
        onFailure: function () { }
    }
});