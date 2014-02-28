blimp-boards-web
================

Blimp Boards Front-End for the web client.

![wercker status](https://app.wercker.com/status/6618c352f999f43ba14a55b3ac2a36f5/s/ "wercker status")

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
