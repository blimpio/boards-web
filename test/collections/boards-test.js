describe('BoardsCollection', function() {
  var BoardsCollection = require('collections/boards');

  describe('when instantiated.', function() {
    var boardsCollection;

    before(function() {
      boardsCollection = new BoardsCollection([{
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:21:54.134Z',
        date_modified: '2014-02-24T21:39:39.283Z',
        id: 2,
        is_shared: false,
        name: 'Designs_',
        slug: 'designs-1',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }, {
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:19:43.334Z',
        date_modified: '2014-02-24T21:21:12.674Z',
        id: 1,
        is_shared: false,
        name: 'Inspiration',
        slug: 'designs',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }]);
    });

    it('should exist.', function() {
      expect(boardsCollection).to.exist;
    });

    it('should have a url property.', function() {
      expect(boardsCollection.url).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardsCollection.name).to.exist;
      expect(boardsCollection.name).to.equal('Boards');
    });

    it('should have a model property.', function() {
      expect(boardsCollection.model).to.exist;
    });

    it('should have a subscriptions property.', function() {
      expect(boardsCollection.subscriptions).to.exist;
    });

    after(function() {
      boardsCollection.reset();
    });
  });

  describe('setCurrent()', function() {
    var boardsCollection;

    before(function() {
      boardsCollection = new BoardsCollection([{
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:21:54.134Z',
        date_modified: '2014-02-24T21:39:39.283Z',
        id: 2,
        is_shared: false,
        name: 'Designs_',
        slug: 'designs-1',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }, {
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:19:43.334Z',
        date_modified: '2014-02-24T21:21:12.674Z',
        id: 1,
        is_shared: false,
        name: 'Inspiration',
        slug: 'designs',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }]);
    });

    it('should set the current property to the id of the matched account given a slug.', function() {
      boardsCollection.setCurrent('designs-1');
      expect(boardsCollection.current).to.equal(2);
      boardsCollection.setCurrent('designs');
      expect(boardsCollection.current).to.equal(1);
    });

    it('should set the current property to null given a slug does not match any account.', function() {
      boardsCollection.setCurrent('acme-llc');
      expect(boardsCollection.current).to.be.null;
    });

    after(function() {
      boardsCollection.reset();
    });
  });

  describe('currentBoard()', function() {
    var boardsCollection;

    before(function() {
      boardsCollection = new BoardsCollection([{
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:21:54.134Z',
        date_modified: '2014-02-24T21:39:39.283Z',
        id: 2,
        is_shared: false,
        name: 'Designs_',
        slug: 'designs-1',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }, {
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:19:43.334Z',
        date_modified: '2014-02-24T21:21:12.674Z',
        id: 1,
        is_shared: false,
        name: 'Inspiration',
        slug: 'designs',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }]);
    });

    it('should return a the current board.', function() {
      boardsCollection.current = 2;
      expect(boardsCollection.currentBoard().attributes).to.eql(boardsCollection.at(0).attributes);
    });

    after(function() {
      boardsCollection.reset();
    });
  });

  describe('onBoardSelected()', function() {
    var boardsCollection;

    before(function() {
      boardsCollection = new BoardsCollection([{
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:21:54.134Z',
        date_modified: '2014-02-24T21:39:39.283Z',
        id: 2,
        is_shared: false,
        name: 'Designs_',
        slug: 'designs-1',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }, {
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:19:43.334Z',
        date_modified: '2014-02-24T21:21:12.674Z',
        id: 1,
        is_shared: false,
        name: 'Inspiration',
        slug: 'designs',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }]);
    });

    it('should set the current account id from the given board.', function() {
      boardsCollection.onBoardSelected(boardsCollection.at(1));
      expect(boardsCollection.current).to.equal(1);
    });

    after(function() {
      boardsCollection.reset();
    });
  });
});
