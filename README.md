blimp-boards-web
================

Blimp Boards frontend for the web client.

Dependencies
------------

    $ npm install -g brunch gulp scaffolt bower

Install
-------

    $ git clone git@github.com:GetBlimp/boards-web.git
    $ cd boards-web
    $ npm install
    $ bower install

Run
---

    $ brunch w -s

Tests
-----

    $ gulp test

Generators
----------

    scaffolt view <name>
        → app/views/name.js
        → test/views/name-test.js

    scaffolt formView <name>
        → app/views/name.js
        → test/views/name-test.js

    scaffolt collectionView <name>
        → app/views/name.js
        → test/views/name-test.js
        → app/collections/name.js
        → test/collections/name-test.js
        → app/models/name.js
        → test/models/name-test.js

    scaffolt model <name>
        → app/models/name.js
        → test/models/name-test.js

    scaffolt collection <name>
        → app/models/name.js
        → test/models/name-test.js
        → app/collections/name.js
        → test/collections/name-test.js

    scaffolt style <name>
        → app/views/styles/name.styl

    scaffolt template <name>
        → app/views/templates/name.hbs

Deploying to s3
---------------

    $ gulp deploy

*To deploy static files to s3 you need to have an .env file in your root with the following:*

    STAGING_AWS_S3_BUCKET_NAME=YOUR_S3_BUCKET_NAME
    STAGING_AWS_S3_SECRET_ACCESS_KEY=YOUR_S3_SECRET_ACCESS_KEY
    STAGING_AWS_S3_ACCESS_KEY_ID=YOUR_S3_ACCESS_KEY_ID
    PRODUCTION_AWS_S3_BUCKET_NAME=YOUR_S3_BUCKET_NAME
    PRODUCTION_AWS_S3_SECRET_ACCESS_KEY=YOUR_S3_SECRET_ACCESS_KEY
    PRODUCTION_AWS_S3_ACCESS_KEY_ID=YOUR_S3_ACCESS_KEY_ID

TODO
----

- Tests.
- Documentation.
