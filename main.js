

(function () {
    'use strict';

    var debug = 1;

    var arrayOfChanged = []; // changed array elements

    var LDAPConfigTemplate = {
        "configEntities": {
            "identityStore": {
                "_type": "identityStoreType",
                "type": "activedirectory",
                "domain": "",
                "root": "",
                "nickname": "",
                "hostname": "",
                "port": "",
                "sslPort": "",
                "directoryServiceType": "openldap",
                "bind": "",
                "username": "",
                "password": "",
                "kerberosPrincipal": "",
                "identityStoreSchemaType": {
                    "distinguishedNameAttribute": "",
                    "userBaseDn": "",
                    "userBaseFilter": "",
                    "userUsername": "",
                    "userDisplayName": "",
                    "userEmail": "",
                    "userCertificate": "",
                    "userThumbnail": "",
                    "userJpegPhoto": "",
                    "memberOf": "",
                    "groupBaseDn": "",
                    "groupClassNames": "",
                    "groupBaseFilter": "",
                    "groupName": "",
                    "groupEmail": "",
                    "groupDescription": "",
                    "member": "",
                    "serverSideSorting": "",
                    "rangeRetrieval": "",
                    "membersRetrievalPageSize": ""
                }
            }
        }
    }

    // variable to map configEntities (template) to config keys (for tsm configuration set -k ... -v ...)
    var mapTemplateToTsmConfigKey = {
        //    type	N/A	wgserver.authenticate  --> cannot change.  don't export
        //    directoryServiceType	N/A	wgserver.domain.directoryservice.type
        "configEntities.identityStore.hostname": "wgserver.domain.ldap.hostname",
        "configEntities.identityStore.sslPort": "wgserver.domain.ssl_port",
        "configEntities.identityStore.port": "wgserver.domain.port",
        "configEntities.identityStore.domain": "wgserver.domain.default",
        "configEntities.identityStore.root": "wgserver.domain.ldap.root",
        "configEntities.identityStore.username": "wgserver.domain.username",
        "configEntities.identityStore.password": "wgserver.domain.password",
        "configEntities.identityStore.identityStoreSchemaType.userBaseDn": "wgserver.domain.ldap.user.baseDn",
        "configEntities.identityStore.identityStoreSchemaType.userBaseFilter": "wgserver.domain.ldap.user.baseFilter",
        "configEntities.identityStore.identityStoreSchemaType.userClassNames": "wgserver.domain.ldap.user.classnames",
        "configEntities.identityStore.identityStoreSchemaType.distinguishedNameAttribute": "wgserver.domain.ldap.dnAttribute",
        "configEntities.identityStore.identityStoreSchemaType.userUsername": "wgserver.domain.ldap.user.username",
        "configEntities.identityStore.identityStoreSchemaType.userDisplayName": "wgserver.domain.ldap.user.displayname",
        "configEntities.identityStore.identityStoreSchemaType.userEmail": "wgserver.domain.ldap.user.email",
        "configEntities.identityStore.identityStoreSchemaType.userCertificate": "wgserver.domain.ldap.user.usercertificate",
        "configEntities.identityStore.identityStoreSchemaType.userThumbnail": "wgserver.domain.ldap.user.thumbnail",
        "configEntities.identityStore.identityStoreSchemaType.userJpegPhoto": "wgserver.domain.ldap.user.jpegphoto",
        "configEntities.identityStore.identityStoreSchemaType.memberOf": "wgserver.domain.ldap.user.memberof",

        "configEntities.identityStore.identityStoreSchemaType.groupBaseDn": "wgserver.domain.ldap.group.baseDn",
        "configEntities.identityStore.identityStoreSchemaType.groupBaseFilter": "wgserver.domain.ldap.group.baseFilter",
        "configEntities.identityStore.identityStoreSchemaType.groupClassNames": "wgserver.domain.ldap.group.classnames",
        "configEntities.identityStore.identityStoreSchemaType.groupName": "wgserver.domain.ldap.group.name",
        "configEntities.identityStore.identityStoreSchemaType.groupEmail": "wgserver.domain.ldap.group.email",
        "configEntities.identityStore.identityStoreSchemaType.groupDescription": "wgserver.domain.ldap.group.description",
        "configEntities.identityStore.identityStoreSchemaType.member": "wgserver.domain.ldap.group.member",

        //N/A":"N/A":"wgserver.domain.ldap.group.memberURL",

        "configEntities.identityStore.bind": "wgserver.domain.ldap.bind",
        "configEntities.identityStore.kerberosPrincipal": "wgserver.domain.ldap.principal",
        //kerberosConfig	kerbconfig	No direct mapping
        //kerberosKeytab	kerbkeytab	No direct mapping

        // Misc
        "configEntities.identityStore.identityStoreSchemaType.membersRetrievalPageSize": "wgserver.domain.ldap.members.retrieval.page.size",
        "configEntities.identityStore.identityStoreSchemaType.serverSideSorting": "wgserver.domain.ldap.server_side_sorting",
        "configEntities.identityStore.identityStoreSchemaType.rangeRetrieval": "wgserver.domain.ldap.range_retrieval"

    }

    var mapTSMtoInputs = {
        // basic settings
        "configEntities.identityStore.hostname": "idstoreform.hostname.value",
        "configEntities.identityStore.domain": "idstoreform.domain.value",
        "configEntities.identityStore.root": "idstoreform.root.value",

        "configEntities.identityStore.port": "idstoreform.portNumber.value",
        "configEntities.identityStore.sslPort": "idstoreform.sslPortNumber.value",
        "configEntities.identityStore.username": "idstoreform.username.value",
        "configEntities.identityStore.password": "idstoreform.password.value",

        // user settings
        "configEntities.identityStore.identityStoreSchemaType.userBaseDn": "userform.userBaseDn.value",
        "configEntities.identityStore.identityStoreSchemaType.userBaseFilter": "userform.userBaseFilter.value",
        "configEntities.identityStore.identityStoreSchemaType.userClassNames": "userform.userClassNames.value",
        "configEntities.identityStore.identityStoreSchemaType.distinguishedNameAttribute": "userform.userdnAttribute.value",
        "configEntities.identityStore.identityStoreSchemaType.userUsername": "userform.userUsername.value",
        "configEntities.identityStore.identityStoreSchemaType.userDisplayName": "userform.userDisplayName.value",
        "configEntities.identityStore.identityStoreSchemaType.userEmail": "userform.userEmail.value",
        "configEntities.identityStore.identityStoreSchemaType.userCertificate": "userform.userCertificate.value",
        "configEntities.identityStore.identityStoreSchemaType.userThumbnail": "userform.userThumbnail.value",
        "configEntities.identityStore.identityStoreSchemaType.userJpegPhoto": "userform.userJpegPhoto.value",
        "configEntities.identityStore.identityStoreSchemaType.memberOf": "userform.userMemberOf.value",

        // group settings
        "configEntities.identityStore.identityStoreSchemaType.groupBaseDn": "groupform.groupBaseDn.value",
        "configEntities.identityStore.identityStoreSchemaType.groupBaseFilter": "groupform.groupBaseFilter.value",
        "configEntities.identityStore.identityStoreSchemaType.groupClassNames": "groupform.groupClassNames.value",
        "configEntities.identityStore.identityStoreSchemaType.groupName": "groupform.groupGroupname.value",
        "configEntities.identityStore.identityStoreSchemaType.groupEmail": "groupform.groupEmail.value",
        "configEntities.identityStore.identityStoreSchemaType.groupDescription": "groupform.groupDescription.value",
        "configEntities.identityStore.identityStoreSchemaType.member": "groupform.groupMember.value",


        // misc settings
        "configEntities.identityStore.identityStoreSchemaType.membersRetrievalPageSize": "miscform.membersRetrievalPageSize.value",
        "configEntities.identityStore.identityStoreSchemaType.rangeRetrieval": "miscform.rangeRetrieval.value",
        "configEntities.identityStore.identityStoreSchemaType.serverSideSorting": "miscform.serverSideSorting.value",

        // kerberos
        "configEntities.identityStore.bind": "kerberosform.bind.value",
        "configEntities.identityStore.kerberosPrincipal": "kerberosform.kerberosPrincipal.value"
    }

    /*
    Sample output from workgroup.yml file


    wgserver.domain.ldap.members.retrieval.page.size: 1500
    wgserver.domain.port: 0
    wgserver.domain.ssl_port: 0
    wgserver.domain.fqdn: null
    wgserver.domain.nickname: null
    wgserver.domain.default: tableau.com
    wgserver.domain.username: testuser
    wgserver.domain.password: null
    wgserver.domain.ldap.kerberos.login: null
    wgserver.domain.ldap.kerberos.conf: /var/opt/tableau/tableau_server/data/tabsvc/config/vizportal_0.20183.18.1019.1426/files/krb.conf
    wgserver.domain.ldap.kerberos.keytab: /var/opt/tableau/tableau_server/data/tabsvc/config/vizportal_0.20183.18.1019.1426/files/krb.keytab
    wgserver.domain.ldap.principal: null
    wgserver.domain.ldap.hostname: null
    wgserver.domain.directoryservice.type: activedirectory
    wgserver.domain.ldap.root: null
    wgserver.domain.ldap.server_side_sorting: false
    wgserver.domain.ldap.range_retrieval: false
    wgserver.domain.ldap.connectionpool.timeout_in_ms: null
    wgserver.domain.ldap.bind: simple
    wgserver.domain.ldap.dnAttribute: null
    wgserver.domain.ldap.guid: null
    wgserver.domain.ldap.group.baseDn: null
    wgserver.domain.ldap.group.classnames: null
    wgserver.domain.ldap.group.baseFilter: null
    wgserver.domain.ldap.group.name: null
    wgserver.domain.ldap.group.email: null
    wgserver.domain.ldap.group.description: null
    wgserver.domain.ldap.group.member: null
    wgserver.domain.ldap.group.memberURL: null
    wgserver.domain.ldap.user.baseDn: null
    wgserver.domain.ldap.user.classnames: null
    wgserver.domain.ldap.user.baseFilter: null
    wgserver.domain.ldap.user.username: null
    wgserver.domain.ldap.user.displayname: null
    wgserver.domain.ldap.user.email: null
    wgserver.domain.ldap.user.usercertificate: null
    wgserver.domain.ldap.user.thumbnail: null
    wgserver.domain.ldap.user.jpegphoto: null
    wgserver.domain.ldap.user.memberof: null
    wgserver.domain.ldap.connectionpool.enabled: false

    */

    // just a blank template
    var blankTemplate = {
        "configEntities": {
            "identityStore": {
                "_type": "",
                "type": "",
                "domain": "",
                "root": "",
                "nickname": "",
                "hostname": "",
                "port": "",
                "sslPort": "",
                // "directoryServiceType": "",
                "bind": "",
                "username": "",
                "password": "",
                "kerberosPrincipal": "",
                "identityStoreSchemaType": {
                    "distinguishedNameAttribute": "",
                    "userBaseDn": "",
                    "userBaseFilter": "",
                    "userUsername": "",
                    "userDisplayName": "",
                    "userEmail": "",
                    "userCertificate": "",
                    "userThumbnail": "",
                    "userJpegPhoto": "",
                    "memberOf": "",
                    "groupBaseDn": "",
                    "groupClassNames": "",
                    "groupBaseFilter": "",
                    "groupName": "",
                    "groupEmail": "",
                    "groupDescription": "",
                    "member": "",
                    "serverSideSorting": "",
                    "rangeRetrieval": ""
                }
            }
        }
    }

    // make a copy of the default for when users import YML settings
    var uploadedContent = JSON.parse(JSON.stringify(blankTemplate))
    var resetUploadedContent = function () {
        uploadedContent = JSON.parse(JSON.stringify(blankTemplate))
    }

    // this function formats "tsm configuration set..." commands given a particular variable
    var formatTSMAllCommands = function () {

        // create tsm configuration set commands
        var tsmCommands = ""
        const keys = Object.keys(mapTemplateToTsmConfigKey)
        for (const key of keys) {
            if (debug) console.log("key: ", key)

            if (eval(mapTSMtoInputs[key]) === undefined || eval(mapTSMtoInputs[key]) === "") {
                // tsm configuration set -k wgserver.domain.ldap.user.baseDn -v ou=people,dc=company,dc=com
                tsmCommands += "tsm configuration set -k " + mapTemplateToTsmConfigKey[key] + " -v \"\"\r\n"
            }
            else {
                tsmCommands += "tsm configuration set -k " + mapTemplateToTsmConfigKey[key] + " -v " + eval(mapTSMtoInputs[key]) + "\r\n"

                if (debug) console.log("Keys changed from input values")
                if (debug) console.log("tsm configuration set -k " + mapTemplateToTsmConfigKey[key] + " -v " + eval(mapTSMtoInputs[key]) + "\"\r\n")
            }
        }
        return tsmCommands
    }


    // this function formats "tsm configuration set..." commands given a particular variable
    var formatTSMChangedCommands = function () {

        // create tsm configuration set commands
        var tsmCommands = ""

        var mapInputstoTSM = swap(mapTSMtoInputs)

        if (debug) console.log('array of changed: ', arrayOfChanged)
        //const keys = Object.keys(mapTemplateToTsmConfigKey)
        for (var i = 0; i < arrayOfChanged.length; i++) {
            if (debug) console.log("i: ", i)
            if (debug) console.log("eval: ", eval("LDAPConfigTemplate[mapInputstoTSM[arrayOfChanged[i]]]"))
            if (debug) console.log("ldapconfigtemplate")
            if (debug) console.log(LDAPConfigTemplate)

            var splitConfig = mapInputstoTSM[arrayOfChanged[i]].split(".")

            var val = ""
            if (splitConfig.length === 3) {
                val = LDAPConfigTemplate[splitConfig[0]][splitConfig[1]][splitConfig[2]]
            }
            else {
                val = LDAPConfigTemplate[splitConfig[0]][splitConfig[1]][splitConfig[2]][splitConfig[3]]
            }

            if (val === undefined || val === "") {
                // tsm configuration set -k wgserver.domain.ldap.user.baseDn -v ou=people,dc=company,dc=com
                tsmCommands += "tsm configuration set -k " + mapTemplateToTsmConfigKey[mapInputstoTSM[arrayOfChanged[i]]] + " -v \"\"\r\n"
            }
            else {

                tsmCommands += "tsm configuration set -k " + mapTemplateToTsmConfigKey[mapInputstoTSM[arrayOfChanged[i]]] + " -v " + val + "\r\n"

                if (debug) console.log("Keys changed from input values")
                if (debug) console.log("tsm configuration set -k " + mapTemplateToTsmConfigKey[mapInputstoTSM[arrayOfChanged[i]]] + " -v " + val)
            }
        }
        return tsmCommands

    }


    // this is the command to update the output in the finalize tab
    var updateFinalize = function () {
        // update the output with the template
        $('#output').html(JSON.stringify(LDAPConfigTemplate, null, 4))

        $("#tsmOutputAll").html(formatTSMAllCommands())
        $("#tsmOutputChanged").html(formatTSMChangedCommands())
        // differencesInTSM()

    }

    var addArrayOfChanged = function (changed) {
        if (arrayOfChanged.indexOf(changed) === -1) {
            arrayOfChanged.push(changed)
        }
    }

    // any time a form element is changed, add it to the changed array for processing later.
    $('form :input').on('change', function (e) {

        if (!($(this)[0].type === "radio" || $(this)[0].type === "checkbox")) {
            var changed = $(this).closest('form')[0].id + "." + e.currentTarget.id + ".value"
            addArrayOfChanged(changed)
        }

    })

    // toggle password visibility
    $('#passwordToggle').on('click', function (e) {
        if ($('#idstoreform :input[name=password]').attr('type') === "password") {
            $('#idstoreform :input[name=password]').attr('type', 'text')
        }
        else {
            $('#idstoreform :input[name=password]').attr('type', 'password')
        }
    })

    // watch for a change on the upload radio button and show/hide the right fields
    $('#uploadform input[name=uploadSelect]').on('change', function (e) {
        if (debug) console.log(e.currentTarget.value)
        if (e.currentTarget.value === 'scratch') {
            $("#upload").hide()
            $("#uploadBtn").hide()
        }
        else {
            $("#upload").show()
            $("#uploadBtn").show()
        }
        // to get val directly
        // $("#uploadform input[name=uploadSelect]:checked").val()
    })

    // watch for a change on Domain and propogate domain to all relevant fields
    $('#domain').on('change', function () {

        var vals = idstoreform.domain.value.split('.')
        if (debug) console.log(vals)
        var formatted = "dc=" + vals[0] + ",dc=" + vals[1]
        idstoreform.root.value = formatted
        $("#rootnote").html("(If not " + formatted + " enter correct root below.)")

        userform.userBaseDn.value = "o=users," + formatted
        $("#userBaseDnNote").html('If not ' + userform.userBaseDn.value + " input appropriate value.  Must include root entry.")
        groupform.groupBaseDn.value = "o=groups," + formatted
        $("#groupBaseDnNote").html('If not ' + groupform.groupBaseDn.value + " input appropriate value.  Must include root entry.")

        idstoreform.hostname.value = "<server>." + idstoreform.domain.value

        // push changed values to array
        addArrayOfChanged("userform.userBaseDn.value")
        addArrayOfChanged("groupform.groupBaseDn.value")
        addArrayOfChanged("idstoreform.root.value")
    })


    var prevPort = 389;
    var prevSslPort = 636;
    // watch for a change on the comm type and update the default port
    $('#idstoreform input[name=communicationsType]').on('change', function (e) {
        if (e.currentTarget.value === 'port') {
            idstoreform.portNumber.value = prevPort
            prevSslPort = idstoreform.sslPortNumber.value
            idstoreform.sslPortNumber.value = ""
            $('#sslPortNumberDiv').hide()
            $('#portNumberDiv').show()

        }
        else {
            idstoreform.sslPortNumber.value = prevSslPort
            prevPort = idstoreform.portNumber.value
            idstoreform.portNumber.value = ""
            $('#sslPortNumberDiv').show()
            $('#portNumberDiv').hide()

        }
        addArrayOfChanged("idstoreform.portNumber.value")
        addArrayOfChanged("idstoreform.sslPortNumber.value")

    })

    // watch for a chang on the output and switch the display
    $('#finalizeform input[name=outputSelect]').on('change', function (e) {
        if (debug) console.log(e.currentTarget.value)
        if (e.currentTarget.value === 'tsmAll') {
            $("#copyTSMAllDiv").show()
            $("#copyTSMChangedDiv").hide()
            $("#copyConfigDiv").hide()
        }
        else if (e.currentTarget.value === 'config') {
            $("#copyTSMAllDiv").hide()
            $("#copyTSMChangedDiv").hide()
            $("#copyConfigDiv").show()
        }
        else {
            $("#copyTSMAllDiv").hide()
            $("#copyTSMChangedDiv").show()
            $("#copyConfigDiv").hide()
        }
    })

    // make sure all templates are updated on the site upon initialization
    updateFinalize();

    // Enable all tooltips
    $('[data-toggle="tooltip"]').tooltip()

    var updateAllValuesFromInput = function () {
        // basic settings
        LDAPConfigTemplate.configEntities.identityStore.hostname = idstoreform.hostname.value
        LDAPConfigTemplate.configEntities.identityStore.domain = idstoreform.domain.value
        LDAPConfigTemplate.configEntities.identityStore.root = idstoreform.root.value

        var commType = $('#idstoreform input[name=communicationsType]:checked').val()
        LDAPConfigTemplate.configEntities.identityStore.port = idstoreform.portNumber.value
        LDAPConfigTemplate.configEntities.identityStore.sslPort = idstoreform.sslPortNumber.value

        // if (commType === "port") {
        //     LDAPConfigTemplate.configEntities.identityStore.sslPort = ""
        // }
        // else {
        //     //ssl
        //     LDAPConfigTemplate.configEntities.identityStore.port = ""
        // }
        LDAPConfigTemplate.configEntities.identityStore.username = idstoreform.username.value
        LDAPConfigTemplate.configEntities.identityStore.password = idstoreform.password.value

        // user settings
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userBaseDn = userform.userBaseDn.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userBaseFilter = userform.userBaseFilter.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userClassNames = userform.userClassNames.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.distinguishedNameAttribute = userform.userdnAttribute.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userUsername = userform.userUsername.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userDisplayName = userform.userDisplayName.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userEmail = userform.userEmail.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userCertificate = userform.userCertificate.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userThumbnail = userform.userThumbnail.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.userJpegPhoto = userform.userJpegPhoto.value
        // if (userform.userMemberOf.value) LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.memberOf = userform.userMemberOf.value

        // group settings
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.groupBaseDn = groupform.groupBaseDn.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.groupBaseFilter = groupform.groupBaseFilter.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.groupClassNames = groupform.groupClassNames.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.groupName = groupform.groupGroupname.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.groupEmail = groupform.groupEmail.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.groupDescription = groupform.groupDescription.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.member = groupform.groupMember.value

        // misc settings
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.membersRetrievalPageSize = miscform.membersRetrievalPageSize.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.rangeRetrieval = miscform.rangeRetrieval.value
        LDAPConfigTemplate.configEntities.identityStore.identityStoreSchemaType.serverSideSorting = miscform.serverSideSorting.value

        // kerberos
        LDAPConfigTemplate.configEntities.identityStore.kerberosPrincipal = kerberosform.kerberosPrincipal.value
        LDAPConfigTemplate.configEntities.identityStore.bind = kerberosform.bind.value


        updateFinalize();
        if (debug) console.log('Updated all settings')
    }

    // update the values if the user navigates via menu and not using the bottom "continue" buttons
    $(".nav-link").on('click', function () {
        updateAllValuesFromInput();
    })

    // handle start/upload page button
    $('#uploadFormSubmit').on('click', function () {
        updateAllValuesFromInput();
        $('#home-tab').tab('show')
    })

    // store values when clicking 
    $('#idstoreformSubmit').on('click', function () {

        if (debug) console.log('Results after Basic Connection is completed.')
        updateAllValuesFromInput();
        if (debug) console.log(LDAPConfigTemplate)
        $('#kerberos-tab').tab('show')
    })

    $("#kerberosFormSubmit").on('click', function () {
        // LDAPConfigTemplate.configEntities.kerberosConfig = kerberosform.kerberosConfig.value
        // LDAPConfigTemplate.configEntities.kerberosKeytab = kerberosform.kerberosKeytab.value
        if (debug) console.log('Results after Kerberos Information is completed.')
        updateAllValuesFromInput();
        if (debug) console.log(LDAPConfigTemplate)
        $('#user-tab').tab('show')

    })

    // watch for a change on kerberos selection
    $('#kerberosform input[name=enableKerberos]').on('change', function (e) {
        if (e.currentTarget.value === 'Yes') {
            kerberosform.bind.value = "gssapi"
            kerberosform.kerberosPrincipal.value = "<user>@" + idstoreform.domain.value
            $('#kerberosEnabledGroup').show()
        }
        else {
            $('#kerberosEnabledGroup').hide()
            LDAPConfigTemplate.configEntities.identityStore.kerberosPrincipal = ''
            kerberosform.kerberosPrincipal.value = ""
            kerberosform.bind.value = "simple"


        }
        addArrayOfChanged("kerberosform.bind.value")
        addArrayOfChanged("kerberosform.kerberosPrincipal.value")
    })

    let alertClassOnce = false;
    // This is to address the bug that userClassNames and groupClassNames cannot
    // be imported in the configEntity template (as of 2019.1)
    $('#userClassNames, #groupClassNames').on('change', function () {
        if (!alertClassOnce) {
            $('#alertText').html('Please see the <a href="README.md#known-issues" class="alert-link">Readme</a> for important information about using Group Names and Class Names in an import template. <p>(This alert will only show once.)')
            $('.alert').show()                
            alertClassOnce=true
        }
    })

    // handle user button
    $('#userFormSubmit').on('click', function () {
        if (debug) console.log('Results after User Information is completed.')
        updateAllValuesFromInput();
        if (debug) console.log(LDAPConfigTemplate)
        $('#group-tab').tab('show')
    })

    // handle group button
    $('#groupFormSubmit').on('click', function () {
        if (debug) console.log('Results after Group Information is completed.')
        updateAllValuesFromInput();
        if (debug) console.log(LDAPConfigTemplate)
        $('#misc-tab').tab('show')
    })

    // handle misc button
    $('#miscFormSubmit').on('click', function () {
        if (debug) console.log('Results after Misc Information is completed.')
        updateAllValuesFromInput();
        if (debug) console.log(LDAPConfigTemplate)
        $('#finalize-tab').tab('show')

    })

    // hide alert
    $('#dismissAlert').on('click', function () {
        $('alertText').html("")
        $('.alert').hide()
    })

    // download config file
    $('#download').on('click', function () {
        download_file("config.json", JSON.stringify(LDAPConfigTemplate, null, 4))
    })

    // download all TSM commands file
    $('#downloadTSMAll').on('click', function () {
        download_file("All_TSM_Commands.txt", $('#tsmOutputAll').html())
    })

    // download changed TSM file
    $('#downloadTSMChanged').on('click', function () {
        download_file("Changed_TSM_Commands.txt", $('#tsmOutputChanged').html())
    })

    // from https://stackoverflow.com/questions/8310657/how-to-create-a-dynamic-file-link-for-download-in-javascript
    var download_file = function (name, contents, mime_type) {
        mime_type = mime_type || "text/plain";

        var blob = new Blob([contents], { type: mime_type });

        var dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function (e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function () {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }

    // from https://stackoverflow.com/questions/23013573/swap-key-with-value-json
    function swap(json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    }

    var uploadType = "none"

    // when the user changes focus off of the upload text area
    $("#upload").on('change', function () {
        //reset uploaded vals var
        resetUploadedContent()

        var uploadIsJSON = false;
        try {
            uploadedContent = JSON.parse($('#upload').val())
            uploadIsJSON = true;
            if (debug) console.log("Uploaded content is JSON")
            // only set this once
            if (uploadType === "none")
                uploadType = "json"
        }
        catch (err) {
            if (debug) console.log("Uploaded content is YML")
            // only set this once
            if (uploadType === "none")
                uploadType = "yml"
        }

        // test to see if user switched upload types
        // if so, abort.  in the future we can reset the entire form
        // but for now just cancel the input
        if ((uploadIsJSON && uploadType === "json")){
            processJSONUpload();
        } 
        
        else if (!uploadIsJSON && uploadType === "yml"){
                // not JSON, so parse YML
                processYMLUpload();
            
        }
        else {
            var resultStr = "This tool does not support switching uploaded content types (JSON to YML or YML to JSON).<br>Please reload the page and start over."
            $('#alertText').html(resultStr)
            $('.alert').show()
        }


        // do this last because of we have an sslPort or other radio change we don't want to capture it.
        arrayOfChanged = [];  // reset array

    })


    var processJSONUpload = function () {
        var resultStr = "";  // hold any errors.
        var countAll = 0; // count of all keys
        var countSuccess = 0; // count of imported keys
        var countSkipped = 0;  // count of skipped keys

        var l1 = "configEntities"
        var l2 = "identityStore"
        var l3 = "identityStoreSchemaType"
        var l2Str = "configEntities.identityStore."
        var l3Str = "configEntities.identityStore.identityStoreSchemaType."

        // loop through configEntities.identityStore keys
        var keys = Object.keys(uploadedContent[l1][l2])
        for (const key of keys) {
            if (debug) console.log("mapping uploaded key: ", key)
            if (debug) console.log("mapping uploaded config key: " + mapTSMtoInputs[l2Str + key] + "=\"" + uploadedContent[l1][l2][key] + "\"")
            


            /*

                                // set radio buttons for selection
                                if (split[2] === 'port' && (entryArr[1] !== 0 || entryArr[1] !== "")){
                                    prevPort = entryArr[1]
                                }                                
                                if (split[2] === 'sslPort' && (entryArr[1] !== 0 || entryArr[1] !== "")){
                                    $("#sslPort").click()
                                    prevSslPort = entryArr[1]
                                }
                                if (split[2] === 'bind' && entryArr[1] === "gssapi")
                                    $("#yeskerberos").click()

            */
            // capture port settings
            if (key==="port"){
                prevPort = uploadedContent[l1][l2][key]
                $('#port').click()

            }
            else if (key === "sslPort" && uploadedContent[l1][l2][key]!=="" && uploadedContent[l1][l2][key]!==0){
                prevSslPort = uploadedContent[l1][l2][key]
                $('#sslPort').click()
            }
            if (key === "bind" && uploadedContent[l1][l2][key]==="gssapi"){
                $("#yesKerberos").click()
            }
            else if (key === "bind" && uploadedContent[l1][l2][key]==="simple"){
                $('#noKerberos').click()
            }
            
            if (mapTSMtoInputs.hasOwnProperty(l2Str + key)) {
                eval(mapTSMtoInputs[l2Str + key] + "=\"" + uploadedContent[l1][l2][key] + "\"")
                countSuccess += 1;
                countAll += 1;
            }
            else {
                resultStr += key + "<br>"
                countSkipped += 1;
                countAll += 1;
            }

        }

        // loop through configEntities.identityStore.identityStoreSchemaType keys
        keys = Object.keys(uploadedContent[l1][l2][l3])
        for (const key of keys) {
            if (debug) console.log("mapping uploaded key: ", key)
            if (debug) console.log("mapping uploaded config key: " + mapTSMtoInputs[l3Str + key] + "=\"" + uploadedContent[l1][l2][l3][key] + "\"")
            if (mapTSMtoInputs.hasOwnProperty(l3Str + key)) {
                eval(mapTSMtoInputs[l3Str + key] + "=\"" + uploadedContent[l1][l2][l3][key] + "\"")
                countSuccess += 1;
                countAll += 1;
            }
            else {
                resultStr += key + "<br>"
                countSkipped += 1;
                countAll += 1;
            }

        }

        resultStr = "Total lines: " + countAll + "<br>Imported: " + countSuccess + " keys<br>&nbsp;<br>Skipped " + countSkipped + " key/value pairs:<br>" + resultStr
        $('#alertText').html(resultStr)
        $('.alert').show()

    }

    // parse YML input
    var processYMLUpload = function () {

        var mapTsmConfigKeyToTemplate = swap(mapTemplateToTsmConfigKey)
        var resultStr = "";  // hold any errors.
        var countAll = 0; // count of all keys
        var countSuccess = 0; // count of imported keys
        var countSkipped = 0;  // count of skipped keys

        // if statement for assessing if we have only one line
        var lines;
        // >= 0 because a blank line with return will yield 0 which would otherwise be false
        try {
            if ($('#upload').val().search(/\n/) >= 0) {

                lines = $('#upload').val().split(/\n/);
            }
        }
        catch (err) {
            lines = $('#upload').val();
        }

        var output = [];
        var outputText = [];
        try {
            for (var i = 0; i <= lines.length; i++) {
                // only push this line if it contains a non whitespace character or is more than 5 chars (arbitrary, but will catch empty lines).
                if (/\S/.test(lines[i] || lines[i].length > 5)) {
                    outputText.push('"' + $.trim(lines[i]) + '"');
                    output.push($.trim(lines[i]));
                    countAll = i + 1;
                }
                else {
                    if (debug) console.log("skipped line number " + i + " with no whitespace: " + lines[i])
                }
            }

        }
        catch (err) {
            $('#alertText').html(err)
            $('.alert').show()
        }

        if (debug) console.log(output);



        // update all forms to match input entry
        output.forEach(function (entry) {



            // var foundMatch = false;
            // if entries don't include : we need to catch it.
            try {
                var entryArr = entry.split(':')
                if (debug) console.log('trying to match... ' + entry)




                var cannotImport = ['wgserver.domain.directoryservice.type', 'wgserver.domain.ldap.kerberos.conf', 'wgserver.domain.ldap.kerberos.keytab', 'wgserver.domain.fqdn', 'wgserver.domain.ldap.kerberos.login', 'wgserver.domain.ldap.guid', 'wgserver.domain.ldap.group.memberURL', 'wgserver.domain.nickname']
                var otherReason = ['wgserver.domain.ldap.group.memberURL', 'wgserver.domain.nickname', 'wgserver.domain.ldap.connectionpool.enabled', 'wgserver.domain.ldap.connectionpool.timeout_in_ms']
                if (entry.length > 5) {
                    entryArr[1] = entryArr[1].trim()

                    if (cannotImport.indexOf(entryArr[0]) !== -1) {
                        resultStr += entryArr[0] + " (cannot be changed)<br>"
                        countSkipped += 1
                        if (debug) console.log("Import of key skipped (cannot be changed): ", entry)
                    }
                    else if (otherReason.indexOf(entryArr[0]) !== -1) {
                        resultStr += entryArr[0] + " (not imported for other reason)<br>"
                        countSkipped += 1
                        if (debug) console.log("Import of key skipped (not imported for other reason/AD/no template entry): ", entry)
                    }
                    else {
                        // if entries are null, treat as blank
                        if (entryArr[1] === "null")
                            entryArr[1] = ""

                        // only fill in form values for entres that have values
                        if (entryArr[1] !== "null" || entryArr[1] !== "") {

                            // try to match against a list of keys to see if it is valid
                            if (mapTsmConfigKeyToTemplate.hasOwnProperty(entryArr[0])) {
                                // eval allows us to take a string (eg `idstoreform.username.value = "testuser"`)
                                // and evaluate it as a statement
                                eval(mapTSMtoInputs[mapTsmConfigKeyToTemplate[entryArr[0]]] + "=\"" + entryArr[1] + "\"")

                                // assign input YML values to object for comparison later.
                                var split = mapTsmConfigKeyToTemplate[entryArr[0]].split('.')
                                if (split.length === 3) {
                                    uploadedContent[split[0]][split[1]][split[2]] = entryArr[1]
                                }
                                else {
                                    uploadedContent[split[0]][split[1]][split[2]][split[3]] = entryArr[1]
                                }

                                // set radio buttons for selection
                                if (split[2] === 'port' && (entryArr[1] !== 0 || entryArr[1] !== "")){
                                    prevPort = entryArr[1]
                                    $('#port').click()
                                }                                
                                if (split[2] === 'sslPort' && (entryArr[1] !== 0 || entryArr[1] !== "")){
                                    $("#sslPort").click()
                                    prevSslPort = entryArr[1]
                                }
                                if (split[2] === 'bind' && entryArr[1] === "gssapi")
                                    $("#yeskerberos").click()
                                else if (split[2] === 'bind' && entryArr[1] === "simple"){
                                    $('#noKerberos').click()
                                }

                                if (debug) console.log('Matched ' + entry)
                                countSuccess++;

                            }
                            else {
                                // else for no match test
                                if (debug) console.log("no entry in mapTemplateToTsmConfigKey")
                                countSkipped += 1
                                resultStr += entry + "<br>"
                            }
                        }
                        else {
                            // else for null test
                            if (debug) console.log("entry is null or ''")
                            countSkipped += 1
                            resultStr += entry + "(unknown key)<br>"
                        }
                    }
                }
                else {
                    // else for too short test
                    if (debug) console.log("skipping line '" + entry + "'. To short.")
                    countSkipped += 1
                    resultStr += entry + " (too short/blank)<br>"
                }

            }
            catch (err) {
                if (debug) console.log(err)
                if (debug) console.log('Error inputting line.  Not a valid expression: ' + entry)
                countSkipped += 1
                resultStr += entry + "(error importing this line)<br>"
            }

        })
        resultStr = "Total lines: " + countAll + "<br>Imported: " + countSuccess + " keys<br>&nbsp;<br>Skipped " + countSkipped + " key/value pairs:<br>" + resultStr
        $('#alertText').html(resultStr)
        $('.alert').show()
    }

})();



