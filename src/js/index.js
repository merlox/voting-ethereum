import React from 'react'
import ReactDOM from 'react-dom'
import {default as Web3} from 'web3'
import votingArtifacts from './../../build/contracts/Voting.json'
import contract from 'truffle-contract'

class App extends React.Component{
   constructor(){
      super()

      let provider = null
      this.Voting = contract(votingArtifacts)

      if(typeof web3 != 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         provider = web3.currentProvider
         this.web3 = new Web3(provider)
      }else{
         console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
         provider = new Web3.providers.HttpProvider("http://localhost:8545")
         this.web3 = new Web3(provider)
      }

      this.Voting.setProvider(provider)
      this.state = {
         Meru: 0,
         Irene: 0,
         Maria: 0,
      }

      // Generamos el html del <select>
      this.candidateOptions = Object.keys(this.state).map(candidateName => {
         this.getCandidateVotes(candidateName)
         return <option key={candidateName}>{candidateName}</option>
      })
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

   // TODO Fix why the votes are not getting saved or why it returns always 0
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

   render(){
      return(
         <div>
            <h1>Voting candidates table</h1>
            <table>
               <tbody>
                  <tr>
                     <th>Candidate</th>
                     <th>Votes</th>
                  </tr>
                  <tr>
                     <td>Meru</td>
                     <td ref="candidate-1">{this.state.Meru}</td>
                  </tr>
                  <tr>
                     <td>Irene</td>
                     <td ref="candidate-2">{this.state.Irene}</td>
                  </tr>
                  <tr>
                     <td>Maria</td>
                     <td ref="candidate-3">{this.state.Maria}</td>
                  </tr>
               </tbody>
            </table>
            <select ref='vote-candidate'>{this.candidateOptions}</select>
            <button onClick={() => {

               // Seleccionamos el option correcto
               this.voteCandidate(
                  this.refs['vote-candidate'].children[this.refs['vote-candidate'].selectedIndex].innerHTML
               )
            }}>Send Vote</button>
         </div>
      )
   }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
