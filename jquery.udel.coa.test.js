var coaTestEnvironment = {
    templates: {
        "loading": {
            templateString: $("#loading\\.html").html()
        },
        "saving": {
            templateString: $("#saving\\.html").html()
        },
        "error": {
            templateString: $("#error\\.html").html()
        },
        "new": {
            templateString: $("#new\\.html").html()
        },
        "edit": {
            templateString: $("#edit\\.html").html()
        },
        "view": {
            templateString: $("#view\\.html").html()
        }
    },
    stores: {
        //speedtype: "speedtypeStore.action",
        speedtype: {
            fetch: function(callback, data) {
                callback({
                    result: "SUCCESS",
                    object: {
                        coa: {
                            speedtype: "ITMS11000",
                            setid: "UOD01",
                            account: "120200",
                            purpose: "ITMS11000",
                            source: null,
                            project_id: null,
                            class_field: null,
                            program_code: null,
                            fund_code: "OPBAS",
                            deptid: "02110",
                            budget_ref: null
                        }
                    }
                });
            }
        },
        //get: "getChartfield.action",
        get: {
            fetch: function(callback, data) {
                if (data.id) {
                    callback({
                        result: "SUCCESS",
                        object: {
                            coa: {
                                id: data.id,
                                speedtype: "ITMS11000",
                                setid: "UOD01",
                                account: "120200",
                                purpose: "ITMS11000",
                                source: null,
                                project_id: null,
                                class_field: null,
                                program_code: null,
                                fund_code: "OPBAS",
                                deptid: "02110",
                                budget_ref: null
                            }
                        }
                    });
                }
                else {
                    callback({
                        result: "FAILURE",
                        errors: ["id not specified"]
                    });
                }
            }
        },
        //save: "saveChartfield.action",
        save: {
            fetch: function(callback, data) {
                callback({
                    result: "SUCCESS",
                    object: {
                        coa: {
                            id: (data.id ? data.id : 2123)
                        }
                    }
                });
            }
        },
        //autocomplete: "autocompleteChartfield.action",
        autocomplete: {
            fetch: function(callback, data) {
                callback({
                    result: "SUCCESS",
                    object: []
                });
            }
        },
        //validate: "validateChartfield.action"
        validate: {
            fetch: function(callback, data) {
                callback({
                    result: "SUCCESS",
                    object: true
                });
            }
        }
    }
};
