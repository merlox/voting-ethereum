const Voting = artifacts.require('Voting')

contract('Voting', accounts => {
   it('Should increase the vote by one of the candidate Meru', () => {
      let votesBefore = 0
      let instance = null

      return Voting.deployed().then(thisInstance => {
         instance = thisInstance
         return instance.getVotesCandidate.call('Meru')
      }).then(votes => {
         votesBefore = parseInt(votes)
         return instance.voteCandidate('Meru')
      }).then(voted => {
         return instance.getVotesCandidate.call('Meru')
      }).then(votesAfter => {
         votesAfter = parseInt(votesAfter)
         assert.equal(votesBefore + 1, votesAfter)
      })
   })

   it('Should get the votes of the candidate Irene and it must be 0', () => {

      // Get the votes
      return Voting.deployed().then(instance => {
         return instance.getVotesCandidate.call('Irene')
      }).then(votes => {
         assert.equal(votes, 0, 'The votes aren\'t 0')
      })
   })

   it('Should check that the candidate Meru exists', () => {
      return Voting.deployed().then(instance => {
         return instance.checkCandidateExists.call('Meru')
      }).then(exists => {
         assert.equal(exists, true)
      })
   })

   it('Should add a candidate that doesn\'t exist', () => {
      let instance = null

      return Voting.deployed().then(thisInstance => {
         instance = thisInstance
         return instance.createCandidate('Merlox')
      }).then(result => {
         return instance.checkCandidateExists.call('Merlox')
      }).then(exists => {
         assert.equal(exists, true)
      })
   })
})
