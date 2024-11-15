;(function ($, undefined) {
    'use strict'
    if ($.rails !== undefined) {
        $.error('jquery-ujs has already been loaded!')
    }
    var rails
    var $document = $(document)
    $.rails = rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',
        fileInputSelector: 'input[type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',
        csrfToken: function () {
            return $('meta[name=csrf-token]').attr('content')
        },
        csrfParam: function () {
            return $('meta[name=csrf-param]').attr('content')
        },
        CSRFProtection: function (xhr) {
            var token = rails.csrfToken()
            if (token) xhr.setRequestHeader('X-CSRF-Token', token)
        },
        refreshCSRFTokens: function () {
            $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken())
        },
        fire: function (obj, name, data) {
            var event = $.Event(name)
            obj.trigger(event, data)
            return event.result !== false
        },
        confirm: function (message) {
            return confirm(message)
        },
        ajax: function (options) {
            return $.ajax(options)
        },
        href: function (element) {
            return element[0].href
        },
        isRemote: function (element) {
            return element.data('remote') !== undefined && element.data('remote') !== false
        },
        handleRemote: function (element) {
            var method, url, data, withCredentials, dataType, options
            if (rails.fire(element, 'ajax:before')) {
                withCredentials = element.data('with-credentials') || null
                dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType)
                if (element.is('form')) {
                    method = element.data('ujs:submit-button-formmethod') || element.attr('method')
                    url = element.data('ujs:submit-button-formaction') || element.attr('action')
                    data = $(element[0].elements).serializeArray()
                    var button = element.data('ujs:submit-button')
                    if (button) {
                        data.push(button)
                        element.data('ujs:submit-button', null)
                    }
                    element.data('ujs:submit-button-formmethod', null)
                    element.data('ujs:submit-button-formaction', null)
                } else if (element.is(rails.inputChangeSelector)) {
                    method = element.data('method')
                    url = element.data('url')
                    data = element.serialize()
                    if (element.data('params')) data = data + '&' + element.data('params')
                } else if (element.is(rails.buttonClickSelector)) {
                    method = element.data('method') || 'get'
                    url = element.data('url')
                    data = element.serialize()
                    if (element.data('params')) data = data + '&' + element.data('params')
                } else {
                    method = element.data('method')
                    url = rails.href(element)
                    data = element.data('params') || null
                }
                options = {
                    type: method || 'GET',
                    data: data,
                    dataType: dataType,
                    beforeSend: function (xhr, settings) {
                        if (settings.dataType === undefined) {
                            xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script)
                        }
                        if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
                            element.trigger('ajax:send', xhr)
                        } else {
                            return false
                        }
                    },
                    success: function (data, status, xhr) {
                        element.trigger('ajax:success', [data, status, xhr])
                    },
                    complete: function (xhr, status) {
                        element.trigger('ajax:complete', [xhr, status])
                    },
                    error: function (xhr, status, error) {
                        element.trigger('ajax:error', [xhr, status, error])
                    },
                    crossDomain: rails.isCrossDomain(url),
                }
                if (withCredentials) {
                    options.xhrFields = { withCredentials: withCredentials }
                }
                if (url) {
                    options.url = url
                }
                return rails.ajax(options)
            } else {
                return false
            }
        },
        isCrossDomain: function (url) {
            var originAnchor = document.createElement('a')
            originAnchor.href = location.href
            var urlAnchor = document.createElement('a')
            try {
                urlAnchor.href = url
                urlAnchor.href = urlAnchor.href
                return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host)
            } catch (e) {
                return true
            }
        },
        handleMethod: function (link) {
            var href = rails.href(link),
                method = link.data('method'),
                target = link.attr('target'),
                csrfToken = rails.csrfToken(),
                csrfParam = rails.csrfParam(),
                form = $('<form method="post" action="' + href + '"></form>'),
                metadataInput = '<input name="_method" value="' + method + '" type="hidden" />'
            if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
                metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />'
            }
            if (target) {
                form.attr('target', target)
            }
            form.hide().append(metadataInput).appendTo('body')
            form.submit()
        },
        formElements: function (form, selector) {
            return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector)
        },
        disableFormElements: function (form) {
            rails.formElements(form, rails.disableSelector).each(function () {
                rails.disableFormElement($(this))
            })
        },
        disableFormElement: function (element) {
            var method, replacement
            method = element.is('button') ? 'html' : 'val'
            replacement = element.data('disable-with')
            if (replacement !== undefined) {
                element.data('ujs:enable-with', element[method]())
                element[method](replacement)
            }
            element.prop('disabled', true)
            element.data('ujs:disabled', true)
        },
        enableFormElements: function (form) {
            rails.formElements(form, rails.enableSelector).each(function () {
                rails.enableFormElement($(this))
            })
        },
        enableFormElement: function (element) {
            var method = element.is('button') ? 'html' : 'val'
            if (element.data('ujs:enable-with') !== undefined) {
                element[method](element.data('ujs:enable-with'))
                element.removeData('ujs:enable-with')
            }
            element.prop('disabled', false)
            element.removeData('ujs:disabled')
        },
        allowAction: function (element) {
            var message = element.data('confirm'),
                answer = false,
                callback
            if (!message) {
                return true
            }
            if (rails.fire(element, 'confirm')) {
                try {
                    answer = rails.confirm(message)
                } catch (e) {
                    ;(console.error || console.log).call(console, e.stack || e)
                }
                callback = rails.fire(element, 'confirm:complete', [answer])
            }
            return answer && callback
        },
        blankInputs: function (form, specifiedSelector, nonBlank) {
            var inputs = $(),
                input,
                valueToCheck,
                selector = specifiedSelector || 'input,textarea',
                allInputs = form.find(selector)
            allInputs.each(function () {
                input = $(this)
                valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val()
                if (valueToCheck === nonBlank) {
                    if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
                        return true
                    }
                    inputs = inputs.add(input)
                }
            })
            return inputs.length ? inputs : false
        },
        nonBlankInputs: function (form, specifiedSelector) {
            return rails.blankInputs(form, specifiedSelector, true)
        },
        stopEverything: function (e) {
            $(e.target).trigger('ujs:everythingStopped')
            e.stopImmediatePropagation()
            return false
        },
        disableElement: function (element) {
            var replacement = element.data('disable-with')
            if (replacement !== undefined) {
                element.data('ujs:enable-with', element.html())
                element.html(replacement)
            }
            element.bind('click.railsDisable', function (e) {
                return rails.stopEverything(e)
            })
            element.data('ujs:disabled', true)
        },
        enableElement: function (element) {
            if (element.data('ujs:enable-with') !== undefined) {
                element.html(element.data('ujs:enable-with'))
                element.removeData('ujs:enable-with')
            }
            element.unbind('click.railsDisable')
            element.removeData('ujs:disabled')
        },
    }
    if (rails.fire($document, 'rails:attachBindings')) {
        $.ajaxPrefilter(function (options, originalOptions, xhr) {
            if (!options.crossDomain) {
                rails.CSRFProtection(xhr)
            }
        })
        $(window).on('pageshow.rails', function () {
            $($.rails.enableSelector).each(function () {
                var element = $(this)
                if (element.data('ujs:disabled')) {
                    $.rails.enableFormElement(element)
                }
            })
            $($.rails.linkDisableSelector).each(function () {
                var element = $(this)
                if (element.data('ujs:disabled')) {
                    $.rails.enableElement(element)
                }
            })
        })
        $document.delegate(rails.linkDisableSelector, 'ajax:complete', function () {
            rails.enableElement($(this))
        })
        $document.delegate(rails.buttonDisableSelector, 'ajax:complete', function () {
            rails.enableFormElement($(this))
        })
        $document.delegate(rails.linkClickSelector, 'click.rails', function (e) {
            var link = $(this),
                method = link.data('method'),
                data = link.data('params'),
                metaClick = e.metaKey || e.ctrlKey
            if (!rails.allowAction(link)) return rails.stopEverything(e)
            if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link)
            if (rails.isRemote(link)) {
                if (metaClick && (!method || method === 'GET') && !data) {
                    return true
                }
                var handleRemote = rails.handleRemote(link)
                if (handleRemote === false) {
                    rails.enableElement(link)
                } else {
                    handleRemote.fail(function () {
                        rails.enableElement(link)
                    })
                }
                return false
            } else if (method) {
                rails.handleMethod(link)
                return false
            }
        })
        $document.delegate(rails.buttonClickSelector, 'click.rails', function (e) {
            var button = $(this)
            if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e)
            if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button)
            var handleRemote = rails.handleRemote(button)
            if (handleRemote === false) {
                rails.enableFormElement(button)
            } else {
                handleRemote.fail(function () {
                    rails.enableFormElement(button)
                })
            }
            return false
        })
        $document.delegate(rails.inputChangeSelector, 'change.rails', function (e) {
            var link = $(this)
            if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e)
            rails.handleRemote(link)
            return false
        })
        $document.delegate(rails.formSubmitSelector, 'submit.rails', function (e) {
            var form = $(this),
                remote = rails.isRemote(form),
                blankRequiredInputs,
                nonBlankFileInputs
            if (!rails.allowAction(form)) return rails.stopEverything(e)
            if (form.attr('novalidate') === undefined) {
                if (form.data('ujs:formnovalidate-button') === undefined) {
                    blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false)
                    if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
                        return rails.stopEverything(e)
                    }
                } else {
                    form.data('ujs:formnovalidate-button', undefined)
                }
            }
            if (remote) {
                nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector)
                if (nonBlankFileInputs) {
                    setTimeout(function () {
                        rails.disableFormElements(form)
                    }, 13)
                    var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs])
                    if (!aborted) {
                        setTimeout(function () {
                            rails.enableFormElements(form)
                        }, 13)
                    }
                    return aborted
                }
                rails.handleRemote(form)
                return false
            } else {
                setTimeout(function () {
                    rails.disableFormElements(form)
                }, 13)
            }
        })
        $document.delegate(rails.formInputClickSelector, 'click.rails', function (event) {
            var button = $(this)
            if (!rails.allowAction(button)) return rails.stopEverything(event)
            var name = button.attr('name'),
                data = name ? { name: name, value: button.val() } : null
            var form = button.closest('form')
            if (form.length === 0) {
                form = $('#' + button.attr('form'))
            }
            form.data('ujs:submit-button', data)
            form.data('ujs:formnovalidate-button', button.attr('formnovalidate'))
            form.data('ujs:submit-button-formaction', button.attr('formaction'))
            form.data('ujs:submit-button-formmethod', button.attr('formmethod'))
        })
        $document.delegate(rails.formSubmitSelector, 'ajax:send.rails', function (event) {
            if (this === event.target) rails.disableFormElements($(this))
        })
        $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function (event) {
            if (this === event.target) rails.enableFormElements($(this))
        })
        $(function () {
            rails.refreshCSRFTokens()
        })
    }
})(jQuery)
