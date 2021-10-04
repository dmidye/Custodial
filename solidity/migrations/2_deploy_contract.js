var Custodier = artifacts.require("./Custodier.sol");
var CustodierFactory = artifacts.require("./CustodierFactory.sol");

module.exports = function(deployer) {
  //deployer.deploy(Custodier, "test", web3.utils.toWei(".01", "ether"), "0x4CBAAa8755EA4FE2536e2661798B2AD2E4854d90");
  deployer.deploy(CustodierFactory);
};