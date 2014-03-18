module.exports = Zeppelin.View.extend({
  name: 'FileUploader',

  el: 'div.file-uploader-wrapper',

  template: require('templates/file-uploader'),

  elements: {
    key: 'input[name=key]',
    policy: 'input[name=policy]',
    signature: 'input[name=signature]',
    accessKey: 'input[name=AWSAccessKeyId]',
    uploadForm: 'form.file-uploader-form',
    contentType: 'input[name=Content-Type]',
    uploadInput: 'input.file-uploader-input'
  },

  initialize: function() {
    this.s3 = [];
    this.files = [];
  },

  onRender: function() {
    this.preparePlugin();
  },

  preparePlugin: function() {
    this.$uploadForm.fileupload({
      dataType: 'xml',
      autoUpload: true,
      add: _.bind(this.onAdd, this),
      done: _.bind(this.onDone, this),
      fail: _.bind(this.onError, this),
      progress: _.bind(this.onProgress, this)
    });
  },

  onAdd: function(event, data) {
    var file;

    file = App.Cards.add({
      type: 'file',
      name: data.files[0].name,
      board: App.Boards.current,
      file_size: data.files[0].size,
      mime_type: data.files[0].type
    });

    this.files.push(file);

    $.ajax({
      url: '/api/files/uploads/sign/',
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
    this.onUploading(file);
    this.$uploadForm.attr('action', s3Params.bucket_url);
    this.$key.val(s3Params.key);
    this.$policy.val(s3Params.policy);
    this.$signature.val(s3Params.signature);
    this.$accessKey.val(s3Params.access_key);
    this.$contentType.val(file.get('mime_type'));
    file.set('content', s3Params.bucket_url + '/' + s3Params.key);
    return this;
  },

  onDone: function(event, data) {
    var file = this.getFileModel(data.files[0]);

    if (file) file.save();
    return this;
  },

  onError: function(event, data) {
    console.log('ERROR', arguments);
  },

  onUploading: function(file) {
    this.publish('card:uploading', file);
    return this;
  },

  onProgress: function(event, data) {
    var file = this.getFileModel(data.files[0]),
        progress = parseInt(data.loaded / data.total * 100, 10);

    if (file) file.set('upload_progress', progress);
    return this;
  },

  getFileModel: function(file) {
    return _.find(this.files, function (fileModel) {
      return fileModel.get('name') === file.name;
    });
  }
});
