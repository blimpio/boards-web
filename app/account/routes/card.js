module.exports = function(account, board, card) {
  if (this.isCurrentController('Account')) {
    this.controller.onCardRoute(board, card);
  } else if (App.PUBLIC_BOARD.id && App.PUBLIC_BOARD.account &&
  !App.Accounts.get(App.PUBLIC_BOARD.account)) {
    this.setController(require('public-board/controller'), {
      card: card,
      board: board
    });
  } else if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('account/controller'), {
      card: card,
      board: board,
      account: account
    });
  }
};
