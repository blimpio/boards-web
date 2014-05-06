module.exports = Zeppelin.Collection.extend({
  model: require('core/models/notification'),

  parse: function(response) {
    this.next = response.next;
    this.count = response.count;
    this.previous = response.previous;
    return response.results;
  },

  hasPagination: function() {
    return (this.next !== null || this.previous !== null) &&
    this.count !== this.length;
  },

  fetchNext: function() {
    return $.getJSON(this.next, _.bind(function(response) {
      this.next = response.next;
      this.count = response.count;
      this.previous = response.previous;
      this.add(response.results);
    }, this));
  }
});
