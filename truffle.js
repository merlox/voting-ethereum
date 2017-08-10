module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
   }, live: {
      host: '217.182.195.23', // gateway.ipfs.io
      port: 80,
      network_id: 3
   }
  }
};
