module.exports = Zeppelin.View.extend({
  template: require('account/templates/file-uploader'),

  elements: {
    key: 'input[name=key]',
    policy: 'input[name=policy]',
    dropZone: 'div.file-uploader-dropzone',
    signature: 'input[name=signature]',
    accessKey: 'input[name=AWSAccessKeyId]',
    uploadForm: 'form.file-uploader-form',
    contentType: 'input[name=Content-Type]',
    uploadInput: 'input.file-uploader-input'
  },

  subscriptions: {
    'fileUploader:trigger': 'triggerPicker'
  },

  context: function() {
    return {
      board: this.options.board.name
    }
  },

  initialize: function() {
    this.s3 = [];
    this.files = [];
    _.bindAll(this, ['onAdd', 'onDone', 'onStop', 'onError',
    'onProgress', 'onDrag', 'onDrop']);
  },

  onRender: function() {
    this.preparePlugin();
  },

  onUnplug: function() {
    $(document).off('dragover dragleave drop');

    if (this.$('form.file-uploader-form').data('blueimp-fileupload')) {
      this.$('form.file-uploader-form').fileupload('destroy');
    }
  },

  triggerPicker: function() {
    this.getElement('uploadInput').click();
  },

  createFile: function(data) {
    var model = Z.Util.getInstance(require('core/models/file'));
    model.set(_.extend(data, {board: this.options.board.id}));
    this.broadcast('card:created', model);
    return model;
  },

  preparePlugin: function() {
    if (this.getElement('uploadForm').data('blueimp-fileupload')) {
      this.getElement('uploadForm').fileupload('destroy');
    }

    this.getElement('uploadForm').fileupload({
      add: this.onAdd,
      done: this.onDone,
      stop: this.onStop,
      fail: this.onError,
      progress: this.onProgress,
      dataType: 'xml',
      autoUpload: true,
      previewCrop: true,
      previewMaxWidth: 300,
      previewMaxHeight: 300,
      disableImageResize: false
    });

    $(document).on('dragover', this.onDrag);
    $(document).on('dragleave drop', this.onDrop);
  },

  enable: function() {
    $(document).on('dragover', this.onDrag);
    $(document).on('dragleave drop', this.onDrop);
    this.getElement('uploadForm').fileupload('enable');
  },

  disable: function() {
    $(document).off('dragover', this.onDrag);
    $(document).off('dragleave drop', this.onDrop);
    this.getElement('uploadForm').fileupload('disable');
  },

  onDrag: function() {
    this.getElement('dropZone').show();
  },

  onDrop: function() {
    this.getElement('dropZone').hide();
  },

  onAdd: function(event, data) {
    var file,
        reader = new FileReader();

    _.preventNavigation('You are uploading files. Your progress will be lost.');

    file = this.createFile({
      name: data.files[0].name,
      file_size: data.files[0].size,
      mime_type: data.files[0].type,
      is_uploading: true
    });

    this.files.push(file);

    $.ajax({
      url: App.API_URL + '/files/uploads/sign/',
      data: {
        name: file.get('name'),
        size: file.get('file_size'),
        type: file.get('mime_type')
      },
      async: false,
      success: _.bind(function(s3Params, statusText, xhr) {
        if (xhr.status === 507) {
          this.onError(statusText, xhr);
        } else {
          this.onS3FileUpload(file, s3Params);
        }
      }, this)
    });

    data.submit();
  },

  onS3FileUpload: function(file, s3Params) {
    file.set('content', s3Params.bucket_url + '/' + s3Params.key);
    this.getElement('uploadForm').attr('action', s3Params.bucket_url);
    this.getElement('key').val(s3Params.key);
    this.getElement('policy').val(s3Params.policy);
    this.getElement('signature').val(s3Params.signature);
    this.getElement('accessKey').val(s3Params.access_key);
    this.getElement('contentType').val(file.get('mime_type'));
    return this;
  },

  onDone: function(event, data) {
    var file = this.getFileModel(data.files[0]);

    if (file) {
      file.save();
      this.broadcast('file:uploaded', file.get('content'));
    }

    return this;
  },

  onStop: function() {
    this.s3 = [];
    this.files = [];
    this.render();
    _.restoreNavigation();
  },

  onError: function(event, data) {
    console.log('ERROR', arguments);
  },

  onProgress: function(event, data) {
    var file = this.getFileModel(data.files[0]),
        progress = parseInt(data.loaded / data.total * 100, 10);

    if (file) {
      if (progress === 100) file.set('is_uploading', false);
      file.set('upload_progress', progress);
    }

    return this;
  },

  getFileModel: function(file) {
    return _.find(this.files, function (fileModel) {
      return fileModel.get('name') === file.name;
    });
  }
});
