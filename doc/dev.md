# How to develop Admin module

- Note: Replace `$SRC` in the following instructions with the folder you put
sources into.

Vanilla repository information can be found at https://ci.open-paas.org/stash/projects/OM/repos/linagora.esn.admin/browse

## Add module to OpenPaaS ESN

**Fork** the Admin repository in your workspace:

https://ci.open-paas.org/stash/projects/OM/repos/linagora.esn.admin?fork

Once forked, **clone** the fork in the folder of your choice:

    cd $SRC
    git clone <your repo>
    # $SRC/linagora.esn.admin now contains Admin module sources.

If not already done, do the same for the OpenPaaS RSE repository in the $SRC
folder (information available at https://ci.open-paas.org/stash/projects/OR/repos/rse/browse).
You must also install all the required dependencies and tools from OpenPaaS RSE
(check README.md).

**Add Admin module to OpenPaaS** by creating a symbolic link in the `$SRC/rse/node_modules` folder:

    cd $SRC/rse
    ln -s $SRC/linagora.esn.admin node_modules/linagora.esn.admin

You can now start OpenPaaS to access to Admin module:

    cd $SRC/rse
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
