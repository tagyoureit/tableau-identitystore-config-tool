

(function () {
    'use strict';


    var openLdapSimpleBindTemplate = {
        "configEntities": {
            "identityStore": {
                "_type": "identityStoreType",
                "type": "activedirectory",
                "domain": "my.root",
                "root": "",
                "nickname": "",
                "hostname": "optional-ldap-server",
                "port": "389",
                "sslPort": "",
                "directoryServiceType": "openldap",
                "bind": "simple",
                "username": "cn=username,dc=your,dc=domain",
                "password": "password",
                "kerberosPrincipal": "",
                "identityStoreSchemaType": {
                    "distinguishedNameAttribute": "",
                    "userBaseDn": "",
                    "userBaseFilter": "(objectClass=inetOrgPerson)",
                    "userUsername": "user",
                    "userDisplayName": "displayname",
                    "userEmail": "email",
                    "userCertificate": "certificate",
                    "userThumbnail": "thumbnail",
                    "userJpegPhoto": "photo",
                    "memberOf": "",
                    "groupBaseDn": "",
                    "groupClassNames": "",
                    "groupBaseFilter": "(objectClass=groupofNames)",
                    "groupName": "groupname",
                    "groupEmail": "groupemail",
                    "groupDescription": "groupdescription",
                    "member": "member",
                    "serverSideSorting": "",
                    "rangeRetrieval": "1500"
                }
            }
        }
    }


    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');

        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);


    $('#domain').on('change', function () {

        var vals = idstoreform.domain.value.split('.')
        console.log(vals)
        var formatted = "dc=" + vals[0] + ",dc=" + vals[1]
        idstoreform.root.value = formatted
        $("#rootnote").html("(If not " + formatted + " enter correct root below.)")

        userform.userBaseDn.value = "o=users," + formatted
        $("#userBaseDnNote").html('If not ' + userform.userBaseDn.value + " input appropriate value.  Must include root entry.")
        groupform.groupBaseDn.value = "o=groups," + formatted
        $("#groupBaseDnNote").html('If not ' + groupform.groupBaseDn.value + " input appropriate value.  Must include root entry.")

        kerberosform.kerberosPrincipal.value = "<user>@"+idstoreform.domain.value
        idstoreform.hostname.value = "<server>."+idstoreform.domain.value
    })

    $('#idstoreform input[name=communicationsType]').on('change', function (e) {
        if (e.currentTarget.value === 'port') {
            idstoreform.portNumber.value = 389
        }
        else {
            idstoreform.portNumber.value = 636
        }
    })



    $('#output').html(JSON.stringify(openLdapSimpleBindTemplate, null, 2))

    // Enable all tooltips

    $('[data-toggle="tooltip"]').tooltip()

    $('#myTab li:last-child a').tab('show')

    $('#idstoreformSubmit').on('click', function () {
        openLdapSimpleBindTemplate.configEntities.identityStore.hostname = idstoreform.hostname.value
        openLdapSimpleBindTemplate.configEntities.identityStore.domain = idstoreform.domain.value
        openLdapSimpleBindTemplate.configEntities.identityStore.root = idstoreform.root.value

        var commType = $('#idstoreform input[name=communicationsType]:checked').val()
        if (commType === "port") {
            openLdapSimpleBindTemplate.configEntities.identityStore.port = idstoreform.portNumber.value
            openLdapSimpleBindTemplate.configEntities.identityStore.sslPort = ""
        }
        else {
            //ssl
            openLdapSimpleBindTemplate.configEntities.identityStore.port = ""
            openLdapSimpleBindTemplate.configEntities.identityStore.sslPort = idstoreform.portNumber.value
        }
        openLdapSimpleBindTemplate.configEntities.identityStore.username = idstoreform.username.value
        openLdapSimpleBindTemplate.configEntities.identityStore.password = idstoreform.password.value
        console.log('Results after Basic Connection is completed.')
        console.log(openLdapSimpleBindTemplate)
        $('#output').html(JSON.stringify(openLdapSimpleBindTemplate, null, 2))
        $('#kerberos-tab').tab('show')
    })

    $("#kerberosFormSubmit").on('click', function () {
        // openLdapSimpleBindTemplate.configEntities.kerberosConfig = kerberosform.kerberosConfig.value
        openLdapSimpleBindTemplate.configEntities.kerberosPrincipal = kerberosform.kerberosPrincipal.value
        // openLdapSimpleBindTemplate.configEntities.kerberosKeytab = kerberosform.kerberosKeytab.value
        console.log('Results after Kerberos Information is completed.')
        console.log(openLdapSimpleBindTemplate)
        $('#user-tab').tab('show')
        $('#output').html(JSON.stringify(openLdapSimpleBindTemplate, null, 2))
    })


    $('#kerberosform input[name=enableKerberos]').on('change', function (e) {
        if (e.currentTarget.value === 'Yes') {
            $('#kerberosEnabledGroup').show()
            openLdapSimpleBindTemplate.configEntities.identityStore.bind = "simple"
            openLdapSimpleBindTemplate.configEntities.kerberosPrincipal = ''

        }
        else {
            $('#kerberosEnabledGroup').hide()
            openLdapSimpleBindTemplate.configEntities.identityStore.bind = "gssapi"
            // openLdapSimpleBindTemplate.configEntities.kerberosConfig = ''
            // openLdapSimpleBindTemplate.configEntities.kerberosPrincipal = ''
            // openLdapSimpleBindTemplate.configEntities.kerberosKeytab = ''
        }
    })

    $('#userFormSubmit').on('click', function () {
        if (userform.userBaseDn.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userBaseDn = userform.userBaseDn.value
        if (userform.userBaseFilter.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userBaseFilter = userform.userBaseFilter.value
        if (userform.userClassNames.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userClassNames = userform.userClassNames.value
        if (userform.userdnAttribute.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userdnAttribute = userform.userdnAttribute.value
        if (userform.userUsername.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userUsername = userform.userUsername.value
        if (userform.userDisplayName.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userDisplayName = userform.userDisplayName.value
        if (userform.userEmail.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userEmail = userform.userEmail.value
        if (userform.userCertificate.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userCertificate = userform.userCertificate.value
        if (userform.userThumbnail.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userThumbnail = userform.userThumbnail.value
        if (userform.userJpegPhoto.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.userJpegPhoto = userform.userJpegPhoto.value
        // if (userform.userMemberOf.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.memberOf = userform.userMemberOf.value
        console.log('Results after User Information is completed.')
        console.log(openLdapSimpleBindTemplate)
        $('#output').html(JSON.stringify(openLdapSimpleBindTemplate, null, 2))
        $('#group-tab').tab('show')
    })


    $('#groupFormSubmit').on('click', function () {
        if (groupform.groupBaseDn.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.groupBaseDn = groupform.groupBaseDn.value
        if (groupform.groupBaseFilter.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.groupBaseFilter = groupform.groupBaseFilter.value
        if (groupform.groupClassNames.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.groupClassNames = groupform.groupClassNames.value
        if (groupform.groupGroupname.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.groupName = groupform.groupGroupname.value
        if (groupform.groupEmail.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.groupEmail = groupform.groupEmail.value
        if (groupform.groupDescription.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.groupDescription = groupform.groupDescription.value
        if (groupform.groupMember.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.member = groupform.groupMember.value
        console.log('Results after Group Information is completed.')
        console.log(openLdapSimpleBindTemplate)
        $('#output').html(JSON.stringify(openLdapSimpleBindTemplate, null, 2))
        $('#misc-tab').tab('show')
    })


    $('#miscFormSubmit').on('click', function () {
        if (miscform.membersRetrievalPageSize.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.membersRetrievalPageSize = miscform.membersRetrievalPageSize.value
        if (miscform.rangeRetrieval.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.rangeRetrieval = miscform.rangeRetrieval.value
        if (miscform.serverSideSorting.value) openLdapSimpleBindTemplate.configEntities.identityStore.identityStoreSchemaType.serverSideSorting = miscform.serverSideSorting.value
        console.log('Results after Misc Information is completed.')
        console.log(openLdapSimpleBindTemplate)
        $('#output').html(JSON.stringify(openLdapSimpleBindTemplate, null, 2))
        $('#finalize-tab').tab('show')
    })


})();
