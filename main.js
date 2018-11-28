

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
                "identityStoreSchemaType": {
                    "userBaseFilter": "(objectClass=inetOrgPerson)",
                    "userUsername": "user",
                    "userDisplayName": "displayname",
                    "userEmail": "email",
                    "userCertificate": "certificate",
                    "userThumbnail": "thumbnail",
                    "userJpegPhoto": "photo",
                    "groupBaseFilter": "(objectClass=groupofNames)",
                    "groupName": "groupname",
                    "groupEmail": "groupemail",
                    "groupDescription": "groupdescription",
                    "member": "member",
                    "distinguishedNameAttribute": "",
                    "serverSideSorting": "",
                    "rangeRetrieval": ""
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

        idstoreform.root.placeholder = "If not dc=" + vals[0] + ",dc=" + vals[1] + " then specify your root entry."
    })


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
            openLdapSimpleBindTemplate.configEntities.identityStore.port = idstoreform.portNumber.value
            openLdapSimpleBindTemplate.configEntities.identityStore.sslPort = idstoreform.portNumber.value
        }
        openLdapSimpleBindTemplate.configEntities.identityStore.username = idstoreform.username.value
        openLdapSimpleBindTemplate.configEntities.identityStore.password = idstoreform.password.value
        console.log('Results after Basic Connection is completed.')
        console.log(openLdapSimpleBindTemplate)

    })



})();
