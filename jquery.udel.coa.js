$(function() {
   $.widget("udel.coa", $.udel.stateWidget, {
        options: {
            name: "coa",
            templateBaseUrl: "https://somelocation/coa/templates/",
            templates: {
                "loading": "loading.html",
                "saving": "saving.html",
                "error": "error.html",
                "new": "new.html",
                "edit": "edit.html",
                "view": "view.html"
            },
            initialData: {
                messages: [],
                errors: [],
                coa: {},
                coaView: {},
                allowEdit: true
            },
            storeBaseUrl: "https://somelocation/coa/",
            stores: {
                speedtype: "speedtypeStore.action",
                get: "getChartfield.action",
                save: "saveChartfield.action",
                autocomplete: "autocompleteChartfield.action",
                validate: "validateChartfield.action"
            },
            states: {
                "Loading": {
                    templateName: "loading",
                    actions: {
                        "new": "New",
                        "existing": "LoadExisting"
                    },
                    init: function(widget, dataIn) {
                        var data = widget.getData();
                        data.coa = data.coa || {};
                        // Default the setid to UOD01.  if its existing, this
                        // will be overwritten later.
                        data.coa.setid = "UOD01";
                        // Get the name of the id field and store it in data.coaIdFieldName 
                        // If it has a value, set the coaId
                        var fieldData = $(widget).fieldsToObj();
                        $.each(fieldData, function(i) {
                            data.coaIdFieldName = i;
                            data.coa.id = fieldData[i];
                            console.log("fieldname->id loaded:" + data.coaIdFieldName + "->" + data.coa.id);
                        });
                        // data.formName is the name of the form for lookups to use
                        // so it doesn't populate other coa's. Get/store the id from a static
                        // cache.
                        $.udel.coa.formId = $.udel.coa.formId || 2;
                        data.formName = $.udel.coa.formId = $.udel.coa.formId + 1;
                        widget.saveData(data);
                    },
                    onTemplateLoad: function(widget) {
                        var data = widget.getData();
                        if (data.coa.id) {
                            widget.doAction("existing", null, true);
                        }
                        else {
                            widget.doAction("new", null, true);
                        }
                    }
                },
                "LoadExisting": {
                    templateName: "loading",
                    actions: {
                        "next": "View"
                    },
                    onTemplateLoad: function(widget) {
                        var data = widget.getData();
                        if (data.coa && data.coa.id) {
                            widget.loadDataFromStore({
                                id: data.coa.id
                            }, function(storeData) {
                                if (storeData && (storeData.result == "SUCCESS")) {
                                    data.coa = (storeData.object && storeData.object.coa) ? storeData.object.coa : null;
                                    data.formName = "coa" + storeData.object.coa.id;
                                    widget.saveData(data);
                                    widget.doAction("next");
                                }
                                else {
                                    $(widget).html('<div id="error">' + "Error loading existing." + '</div>');
                                }
                            }, "?", "get");
                        }
                    }
                },
                "New": {
                    templateName: "new",
                    actions: {
                        "next": function(widget) {
                            var formData = $(widget.element).formToObj();
                            var data = widget.getData();
                            data.coa = formData;
                            widget.saveData(data);
                            return "LoadingSpeedtypeData";
                        },
                        "cancel": "Edit"
                    },
                    onTemplateLoad: function(widget) {
                        $("form", widget.element).validate({
                            messages: {
                                "speedtype": "Provide a valid SpeedType."
                            }
                        });
                        $("input[name=speedtype]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "speedtype", 4));
                        //TODO: speedtype lookup
                        //TODO: setid dropdown
                    }
                },
                "LoadingSpeedtypeData": {
                    templateName: "loading",
                    actions: {
                        "success": "Edit",
                        "failure": "New"
                    },
                    onTemplateLoad: function(widget) {
                        var data = widget.getData();
                        widget.loadDataFromStore({
                            speedtype: data.coa.speedtype,
                            setid: data.coa.setid
                        }, function(storeData) {
                            if ("SUCCESS" == storeData.result) {
                                var id = data.coa.id;
                                data.coa = (storeData.object && storeData.object.coa) ? storeData.object.coa : null;
                                data.coaView = (storeData.object && storeData.object.coaView) ? storeData.object.coaView : null;
                                if (id && data.coa) {
                                    data.coa.id = id;
                                }
                                widget.saveData(data);
                                widget.doAction("success");
                            }
                            else {
                                data.messages = storeData.messages;
                                data.errors = storeData.errors;
                                widget.saveData(data);
                                widget.doAction("failure");
                            }
                        }, "?", "speedtype");
                    }
                },
                "Edit": {
                    templateName: "edit",
                    actions: {
                        "save": function(widget) {
                            var data = widget.getData();
                            var formData = $(widget.element).formToObj();
                            data.coa = $.extend(true, {}, data.coa, formData);
                            widget.saveData(data);
                            return "Saving";
                        },
                        "back": "New",
                        "reset": function(widget) {
                            var data = widget.getData();
                            if (data.coa && data.coa.id) {
                                return "LoadExisting";
                            }
                            else {
                                return "Edit";
                            }
                        }
                    },
                    onTemplateLoad: function(widget) {
                        $("form", widget.element).validate({
                            messages: {
                                "account": "Provide a valid Account.",
                                "classField": "Provide a valid Class.",
                                "userField": "Provide a valid UserField.",
                                "projectId": "Provide a valid Project Id/grant.",
                                "source": "Provide a valid Source.",
                                "resourceType": "Provide a valid Resource type.",
                                "resourceCategory": "Provide a valid Resource category.",
                                "resourceSubcategory": "Provide a valid Resource subcategory.",
                                "budgetRef": "Provide a valid Work order or Budget Reference."
                            }
                        });
                        $("input[name=purpose]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "purpose", 3));
                        $("input[name=account]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "account", 3));
                        $("input[name=classField]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "classField", 2));
                        $("input[name=projectId]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "projectId", 4));
                        $("input[name=source]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "source", 1));
                        $("input[name=resourceType]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "resourceType", 1));
                        $("input[name=resourceCategory]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "resourceCategory", 1));
                        $("input[name=resourceSubcategory]", widget.element).autocomplete(
                        new widget._AutocompleteHelper(widget, "resourceSubcategory", 1));
                        //TODO: lookups
                    }
                },
                "Saving": {
                    templateName: "saving",
                    actions: {
                        "success": "View",
                        "failure": "Edit"
                    },
                    onTemplateLoad: function(widget) {
                        var data = widget.getData();
                        console.log("data:");
                        console.log(data);
                        widget.saveDataToStore({
                            coa: data.coa
                        }, function(storeData) {
                            if ("SUCCESS" == storeData.result) {
                                data.messages = storeData.messages;
                                data.errors = [];
                                data.coa.id = storeData.object.id;
                                data.formName = "coa" + data.coa.id;
                                widget.saveData(data);
                                widget.doAction("success");
                            }
                            else {
                                data.messages = storeData.messages;
                                data.errors = storeData.errors;
                                widget.saveData(data);
                                widget.doAction("failure");
                            }
                        }, "?", "save");
                    }
                },
                "View": {
                    templateName: "view",
                    actions: {
                        "edit": function(widget) {
                            //reset note!
                            var data = widget.getData();
                            data.coa.note = null;
                            widget.saveData(data);
                            return "Edit";
                        }
                    }
                }
            }
        },
        _AutocompleteHelper: function(widget, fieldName, initialInputLength) {
            this.source = function(req, add) {
                if (req.term && req.term.length >= initialInputLength) {
                    $.ajax({
                        url: widget.stores.autocomplete.url,
                        data: {
                            "fieldName": fieldName,
                            "fieldValue": req.term
                        },
                        success: function(data) {
                            if (data && (data.result === "SUCCESS")) {
                                add(data.object);
                            }
                        }
                    });
                }
            };
            this.select = function(event, ui) {
                //TODO: this might not work if not a validated item...
                if (event.type === "autocompleteselect" && event.target) {
                    $(event.target).val(ui.item.value);
                    $(event.target).valid();
                }
            };
        },
        // based on http://docs.jquery.com/Plugins/Validation/Methods/remote
        _ValidateHelper: function(widget) {
            this.validate = function(value, element, param) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }
                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;

                param = typeof param == "string" && {
                    url: param
                } || param;
                if (previous.old !== value) {
                    previous.old = value;
                    var validator = this;
                    this.startRequest(element);
                    var data = {};
                    data.fieldName = element.name;
                    data.fieldValue = value;
                    $.ajax($.extend(true, {
                        url: widget.stores.validate.url,
                        mode: "abort",
                        port: "validate" + element.name,
                        dataType: "json",
                        data: data,
                        success: function(response) {
                            validator.settings.messages[element.name].remote = previous.originalMessage;
                            var valid = false;
                            if (response && (response.result === "SUCCESS")) {
                                valid = response.object;
                            }
                            if (valid) {
                                var submitted = validator.formSubmitted;
                                validator.prepareElement(element);
                                validator.formSubmitted = submitted;
                                validator.successList.push(element);
                                validator.showErrors();
                            } else {
                                var errors = {};
                                var message = (previous.message = response || validator.defaultMessage(element, "remote"));
                                errors[element.name] = $.isFunction(message) ? message(value) : message;
                                validator.showErrors(errors);
                            }
                            previous.valid = valid;
                            validator.stopRequest(element, valid);
                        }
                    }, param));
                    return "pending";
                } else if (this.pending[element.name]) {
                    return "pending";
                }
                return previous.valid;
            };
        },
        _create: function() {
            this._stateWidgetCreate.apply(this, arguments);
            var coaRemoteVal = new this._ValidateHelper(this);
            $.validator.addMethod("coaRemote", coaRemoteVal.validate);
            $.validator.addClassRules({
                "coaRemote": {
                    "coaRemote": true
                }
            });
        }
    });
});
