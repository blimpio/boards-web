module.exports = function(account, board) {
  if (this.isCurrentController('Account')) {
      this.controller.onBoardRoute(board);
  } else if (this.PUBLIC_BOARD.id && this.PUBLIC_BOARD.account &&
  _.indexOf(this.PUBLIC_BOARD.collaborator_users, this.User.id) === -1) {
    this.setController(require('public-board/controller'), {
      board: board
    });
  } else if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('account/controller'), {
      board: board,
      account: account
    });
  }
};
