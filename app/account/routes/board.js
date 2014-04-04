module.exports = function(account, board) {
  if (App.PUBLIC_BOARD.id && App.PUBLIC_BOARD.account &&
  !App.Accounts.get(App.PUBLIC_BOARD.account)) {
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
