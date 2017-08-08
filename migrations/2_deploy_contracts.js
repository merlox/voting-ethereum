var Voting = artifacts.require('./Voting.sol')

module.exports = function(deployer) {
  deployer.deploy(Voting, [
     'Donald Trump',
     'Obama',
     'George Washington',
     'John Adams',
     'Thomas Jefferson',
     'James Monroe',
     'Andrew Jackson',
     'Martin Van Burten',
     'John Tyler',
     'Abraham Lincoln'
  ], {gas: 2900000})
};
