import React from 'react'
import ReactDOM from 'react-dom'
import {default as Web3} from 'web3'
import votingArtifacts from './../../build/contracts/Voting.json'
import contract from 'truffle-contract'
import './../css/index.css'

class App extends React.Component{
   constructor(){
      super()

      let provider = null

      if(typeof web3 != 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         provider = web3.currentProvider
         this.web3 = new Web3(provider)
      }else{
         console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
         provider = new Web3.providers.HttpProvider("http://localhost:8545")
         this.web3 = new Web3(provider)
      }

      this.Voting = contract(votingArtifacts)
      this.Voting.setProvider(provider)
      this.state = {}
      this.getAllCandidates()
   }

   voteCandidate(candidateToVote){
      this.Voting.deployed().then(contractInstance => {

         // Votamos al candidato y luego actualizamos el state de ese candidato
         // POST Request require gas y from
         contractInstance.voteCandidate(candidateToVote, {gas: 20000000, from: this.web3.eth.accounts[0]}).then(a => {
            this.getCandidateVotes(candidateToVote)
         })
      })
   }

   getCandidateVotes(candidate){
      this.Voting.deployed().then(contractInstance => {
         contractInstance.getVotesCandidate.call(candidate).then(votes => {
            votes = parseInt(votes)

            // GET Request no require gas ni from
            this.setState({
               [candidate]: votes
            })
         })
      })
   }

   getAllCandidates(){
      this.Voting.deployed().then(instance => {
         instance.getAllCandidates.call().then(candidates => {
            let candidatesNames = candidates.map(candidate => {
               let name = this.web3.toUtf8(candidate)
               if(name.length > 0)
                  return name
            })

            candidatesNames.forEach((candidate, index) => {
               instance.getVotesCandidate.call(candidate).then(votes => {
                  return parseInt(votes)
               }).then(votes => {
                  this.setState({
                     [candidatesNames[index]]: votes
                  })
               })
            })
         })
      })
   }

   addNewCandidate(candidateName){
      if(candidateName != 'undefined' && candidateName.length > 0){
         const candidateNameHex = this.web3.fromUtf8(candidateName)

         this.Voting.deployed().then(instance => {
            return instance.createCandidate(candidateNameHex, {gas: 2000000, from: this.web3.eth.accounts[0]})
         }).then(result => {
            this.getCandidateVotes(candidateName)
         })
      }
   }

   render(){
      return(
         <div>
            <h1>Vote for the best president</h1>
            <p>Your vote will be reflected when the next block is mined</p>
            <table>
               <tbody>
                  <tr>
                     <th>Candidate</th>
                     <th>Votes</th>
                  </tr>
                  {
                     Object.keys(this.state).map(candidateName => {
                        return (<tr key={candidateName}>
                           <td>{candidateName}</td>
                           <td>{this.state[candidateName]}</td>
                        </tr>)
                     })
                  }
               </tbody>
            </table>

            <section>
               <select ref='vote-candidate'>
                  {
                     Object.keys(this.state).map(candidateName => {
                        return <option key={candidateName}>{candidateName}</option>
                     })
                  }
               </select>
               <button onClick={() => {
                  this.voteCandidate(
                     this.refs['vote-candidate'].children[this.refs['vote-candidate'].selectedIndex].innerHTML
                  )
               }}>Send Vote</button>
            </section>

            <section>
               <input type="text" ref="new-candidate" placeholder="Add new candidate"/>
               <button onClick={() => {
                  this.addNewCandidate(this.refs['new-candidate'].value.trim())
                  this.refs['new-candidate'].value = ''
               }}>Add new candidate</button>
            </section>
         </div>
      )
   }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
