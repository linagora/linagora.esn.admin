# How to develop Admin module

Vanilla repository information can be found at https://ci.open-paas.org/stash/projects/OM/repos/linagora.esn.admin/browse

## Add module to OpenPaaS ESN

**Fork** the Admin repository in your workspace:

https://ci.open-paas.org/stash/projects/OM/repos/linagora.esn.admin?fork

Once forked, **clone** the fork in the folder of your choice, linagora.esn.admin now contains Admin module sources.

If not already done, do the same for the OpenPaaS RSE repository (information available at https://ci.open-paas.org/stash/projects/OR/repos/rse/browse).
You must also install all the required dependencies and tools from OpenPaaS RSE
(check README.md).

**Add Admin module to OpenPaaS** by `npm link`:
First go to the module folder (linagora.esn.admin):

	npm link

Then go to the OpenPaaS RSE folder (rse):

	npm link linagora.esn.admin

You can now start OpenPaaS to access to Admin module (still in OpenPaaS RSE folder):

    npm start # or 'grunt dev'

OpenPaaS should be started and available at http://localhost:8080.

## Run unit tests

Available commands to run unit tests:

```
grunt test
grunt test-unit-backend
grunt test-unit-frontend
grunt test-midway-backend
grunt linters
```
