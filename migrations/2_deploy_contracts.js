var Voting = artifacts.require('./Voting.sol')

module.exports = function(deployer) {
  deployer.deploy(Voting, ['Meru', 'Irene', 'Laura', 'Random'], {gas: 2900000})
};
