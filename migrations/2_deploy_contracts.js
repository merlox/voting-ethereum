var Voting = artifacts.require('./Voting.sol')

module.exports = function(deployer) {
  deployer.deploy(Voting, ['Meru', 'Irene', 'Maria'], {gas: 2900000})
};
