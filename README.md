# Tableau Identity Store Configuration Tool

This tool (initial release) is designed to output an [identity store](https://onlinehelp.tableau.com/current/server-linux/en-us/plan_identity_store.htm) JSON file to use during installation. 

Tableau provides [example files](https://onlinehelp.tableau.com/current/server-linux/en-us/entity_identity_store.htm) but they are not easy for non-LDAP admins to understand.  

This tool aims to make it easier for Tableau Admins to input (or ask their LDAP administrator for) the correct entries to configure Tableau.

### Future enhancements
Future enhancements to this tool may include:
* Configuration files for Local Authentication or Active Directory
* Download the configuration file (instead of copying its contents)
* appropriate TSM commands to change settings if you are past the installation phase
* reading of yaml settings so delta's can be computed