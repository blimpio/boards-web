describe('FileUploader', function() {
  var FileUploader = require('views/file-uploader');

  before(function() {
    $('#application').html('<div class="file-uploader-wrapper"></div>');
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var fileUploader;

    before(function() {
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should exist.', function() {
      expect(fileUploader).to.exist;
    });

    it('should have a name property.', function() {
      expect(fileUploader.name).to.exist;
      expect(fileUploader.name).to.equal('FileUploader');
    });

    it('should have a template property.', function() {
      expect(fileUploader.template).to.exist;
    });

    it('should have a elements property.', function() {
      expect(fileUploader.elements).to.exist;
    });

    after(function() {
      fileUploader.unplug(true);
    });
  });

  describe('preparePlugin()', function() {
    var fileUploader;

    before(function() {
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should init the file upload plugin.', function() {
      fileUploader.preparePlugin();
      expect(fileUploader.$uploadForm.fileupload).to.exist;
    });

    after(function() {
      fileUploader.unplug(true);
    });
  });

  describe('onAdd()', function() {
    var server, fileUploader;

    before(function() {
      App.Boards.current = 2;
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should add a new card model to the Cards collection.', function() {
      var count = App.Cards.length;

      fileUploader.onAdd(null, {
        files: [{
          name: 'image.png',
          size: 123456,
          type: 'image/png'
        }],

        submit: function() {}
      });

      expect(App.Cards.length).to.equal(count + 1);
    });

    after(function() {
      App.Boards.current = null;
      fileUploader.unplug(true);
    });
  });

  describe('onS3FileUpload()', function() {
    var fileUploader;

    before(function() {
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should set s3 params on the upload file form.', function() {
      fileUploader.onS3FileUpload(_.createModel('card', {
        mime_type: 'image/png'
      }), {
        bucket_url: '1',
        key: '2',
        policy: '3',
        signature: '4',
        access_key: '5'
      });

      expect(fileUploader.$uploadForm.attr('action')).to.equal('1');
      expect(fileUploader.$key.val()).to.equal('2');
      expect(fileUploader.$policy.val()).to.equal('3');
      expect(fileUploader.$signature.val()).to.equal('4');
      expect(fileUploader.$accessKey.val()).to.equal('5');
      expect(fileUploader.$contentType.val()).to.equal('image/png');
    });

    after(function() {
      fileUploader.unplug(true);
    });
  });

  describe('onDone()', function() {
    var fileUploader;

    before(function() {
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should save the uploaded file.', function() {
      var cardSpy;
      var card = _.createModel('card', {
        id: 2,
        type: 'file',
        name: 'Test.gif',
        board: 2,
        content: 'http://getblimp.com'
      });

      cardSpy = sinon.spy(card, 'save');

      fileUploader.files = [card];
      fileUploader.onDone({}, {files: [{name: 'Test.gif'}]});
      expect(cardSpy).to.have.been.called;
    });

    after(function() {
      fileUploader.unplug(true);
    });
  });

  describe('onUploading()', function() {
    var publishSpy, fileUploader;

    before(function() {
      publishSpy = sinon.spy(FileUploader.prototype, 'publish');
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should init the file upload plugin.', function() {
      fileUploader.onUploading({id: 1});
      expect(publishSpy).to.have.been.calledWith('card:uploading', {id: 1});
    });

    after(function() {
      fileUploader.unplug(true);
      FileUploader.prototype.publish.restore();
    });
  });

  describe('onProgress()', function() {
    var fileUploader;

    before(function() {
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should set the upload progress on the uploading file model.', function() {
      var card = _.createModel('card', {
        id: 2,
        type: 'file',
        name: 'Test.gif',
        board: 2,
        content: 'http://getblimp.com'
      });

      fileUploader.files = [card];
      fileUploader.onProgress({}, {
        files: [{name: 'Test.gif'}],
        loaded: 90,
        total: 100
      });

      expect(card.get('upload_progress')).to.equal(90);
    });

    after(function() {
      fileUploader.unplug(true);
    });
  });

  describe('getFileModel()', function() {
    var fileUploader;

    before(function() {
      fileUploader = new FileUploader();
      fileUploader.render();
    });

    it('should return a model given a jquery upload file object.', function() {
      var card = _.createModel('card', {
        id: 2,
        type: 'file',
        name: 'Test.gif',
        board: 2,
        content: 'http://getblimp.com'
      });

      fileUploader.files = [card];
      expect(fileUploader.getFileModel({name: 'Test.gif'}).cid).to.equal(card.cid)
    });

    after(function() {
      fileUploader.unplug(true);
    });
  });
});
