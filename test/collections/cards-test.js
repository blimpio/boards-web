describe('CardsCollection', function() {
  var CardsCollection = require('collections/cards');

  describe('when instantiated.', function() {
    var cardsCollection;

    before(function() {
      cardsCollection = new CardsCollection([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }, {
        'created_by':2,
        'id':1,
        'date_created':'2014-02-28T18:25:35.690Z',
        'date_modified':'2014-02-28T18:25:35.698Z',
        'name':'A note',
        'type':'note',
        'slug':'a-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }]);
    });

    it('should exist.', function() {
      expect(cardsCollection).to.exist;
    });

    after(function() {
      cardsCollection.unplug();
    });
  });

  describe('setCurrent()', function() {
    var cardsCollection;

    before(function() {
      cardsCollection = new CardsCollection([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }, {
        'created_by':2,
        'id':1,
        'date_created':'2014-02-28T18:25:35.690Z',
        'date_modified':'2014-02-28T18:25:35.698Z',
        'name':'A note',
        'type':'note',
        'slug':'a-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }]);
    });

    it('should set the current property to the id of the matched account given a slug.', function() {
      cardsCollection.setCurrent('a-note');
      expect(cardsCollection.current).to.equal(1);
      cardsCollection.setCurrent('another-note');
      expect(cardsCollection.current).to.equal(2);
    });

    it('should set the current property to null given a slug does not match any account.', function() {
      cardsCollection.setCurrent('acme-llc');
      expect(cardsCollection.current).to.be.null;
    });

    after(function() {
      cardsCollection.reset();
    });
  });

  describe('getCurrent()', function() {
    var cardsCollection;

    before(function() {
      cardsCollection = new CardsCollection([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }, {
        'created_by':2,
        'id':1,
        'date_created':'2014-02-28T18:25:35.690Z',
        'date_modified':'2014-02-28T18:25:35.698Z',
        'name':'A note',
        'type':'note',
        'slug':'a-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }]);
    });

    it('should return a the current card.', function() {
      cardsCollection.current = 2;
      expect(cardsCollection.getCurrent().attributes).to.eql(cardsCollection.at(0).attributes);
    });

    after(function() {
      cardsCollection.reset();
    });
  });

  describe('onCardSelected()', function() {
    var cardsCollection;

    before(function() {
      cardsCollection = new CardsCollection([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }, {
        'created_by':2,
        'id':1,
        'date_created':'2014-02-28T18:25:35.690Z',
        'date_modified':'2014-02-28T18:25:35.698Z',
        'name':'A note',
        'type':'note',
        'slug':'a-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }]);
    });

    it('should set the current property to the id of the given card.', function() {
      cardsCollection.onCardSelected(cardsCollection.at(0));
      expect(cardsCollection.current).to.equal(2);
    });

    after(function() {
      cardsCollection.reset();
    });
  });

  describe('hasCardsFromBoard()', function() {
    var cardsCollection;

    before(function() {
      cardsCollection = new CardsCollection([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }, {
        'created_by':2,
        'id':1,
        'date_created':'2014-02-28T18:25:35.690Z',
        'date_modified':'2014-02-28T18:25:35.698Z',
        'name':'A note',
        'type':'note',
        'slug':'a-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }]);
    });

    it('should return true if there are cards with the given board id.', function() {
      expect(cardsCollection.hasCardsFromBoard(7)).to.be.true;
    });

    it('should return false if there are no cards with the given board id.', function() {
      expect(cardsCollection.hasCardsFromBoard(711)).to.be.false;
    });

    after(function() {
      cardsCollection.reset();
    });
  });
});
