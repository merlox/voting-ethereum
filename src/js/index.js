import React from 'react'
import ReactDOM from 'react-dom'
import {default as Web3} from 'web3'
import votingArtifacts from './../../build/contracts/Voting.json'
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

      const MyContract = web3.eth.contract(votingArtifacts.abi)
      this.ContractInstance = MyContract.at('0xd320124f114fcf30b56cac0bd826d0554e1a44f8')
      this.state = {}
      this.getAllCandidates()
   }

   voteCandidate(candidateToVote){

      // Votamos al candidato y luego actualizamos el state de ese candidato
      // POST Request require gas y from
      this.ContractInstance.voteCandidate(candidateToVote, {gas: 100000, from: this.web3.eth.accounts[0]}, (err, result) => {
         this.getCandidateVotes(candidateToVote)
      })
   }

   getCandidateVotes(candidate){
      this.ContractInstance.getVotesCandidate(candidate, (err, votes) => {
         votes = parseInt(votes)

         // GET Request no require gas ni from
         this.setState({
            [candidate]: votes
         })
      })
   }

   getAllCandidates(){
      this.ContractInstance.getAllCandidates((err, candidates) => {
         let candidatesNames = candidates.map(candidate => {
            let name = this.web3.toUtf8(candidate)
            if(name.length > 0)
               return name
         })

         candidatesNames.forEach((candidate, index) => {
            this.ContractInstance.getVotesCandidate(candidate, (err, votes) => {
               this.setState({
                  [candidatesNames[index]]: parseInt(votes)
               })
            })
         })
      })
   }

   addNewCandidate(candidateName){
      if(candidateName != 'undefined' && candidateName.length > 0){
         const candidateNameHex = this.web3.fromUtf8(candidateName)

         this.ContractInstance.createCandidate(candidateNameHex, {gas: 100000, from: this.web3.eth.accounts[0]}, (err, result) => {
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
