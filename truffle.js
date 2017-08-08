module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
   }, live: {
      host: '123.456.789',
      port: 80,
      network_id: 1
   }
  }
};
