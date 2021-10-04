const CustodierFactory = artifacts.require('./CustodierFactory.sol');
const fs = require('fs');
require('chai').use(require('chai-as-promised')).should()
const custodier_json = JSON.parse(fs.readFileSync('./build/contracts/Custodier.json', 'utf8'));
const custodier_abi = custodier_json.abi;
//JSON.stringify(contract.abi)

contract('CustodierFactory', ([deployer, creator, contributor1, contributor2, contributor3, contributor4]) => {
  before(async () => {
    custodierFactory = await CustodierFactory.deployed()
  })

  it('deploys successfully', async () => {
    const address = await custodierFactory.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  // probably should break this up....
  it('creates custodier', async () => {
    // have to use this pattern when getting contract via abi and address
    const result = await custodierFactory.createCustodier("test", web3.utils.toWei(".01", "ether"), { from: creator })
    const address = result.logs[0].args.custodier
    const custodier =  new web3.eth.Contract(custodier_abi, address);
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
    console.log("CONTRACT CREATED")

    // check that it sets values correctly
    assert.equal(await custodier.methods.creator().call(), creator, "creator set")
    assert.equal(await custodier.methods.name().call(), "test", "name set")
    assert.equal(await custodier.methods.contribAmount().call(), web3.utils.toWei(".01", "ether"), "contribAmount set")
    console.log("CONTRACT VALUES SET")

    // contribute
    await custodier.methods.contribute().send({ from: contributor1, value: web3.utils.toWei(".01", "ether"), gas: 4000000 })
    await custodier.methods.contribute().send({ from: contributor1, value: web3.utils.toWei(".01", "ether"), gas: 4000000 }).should.be.rejected
    
    await custodier.methods.contribute().send({ from: contributor2, value: web3.utils.toWei(".01", "ether"), gas: 4000000 })
    await custodier.methods.contribute().send({ from: contributor3, value: web3.utils.toWei(".01", "ether"), gas: 4000000 })
    await custodier.methods.contribute().send({ from: contributor4, value: web3.utils.toWei(".01", "ether"), gas: 4000000 })
    console.log("CONTRIBUTIONS MADE -- NO DUPLICATES ALLOWED")
    const contribCount = await custodier.methods.contribCount().call()
    assert.equal(contribCount, 4, "4 contributions made")
    

    // test that contract receives ether
    var balanceAfterContributions = await web3.eth.getBalance(address)
    var balanceShouldBe = web3.utils.toBN(web3.utils.toWei(".04", "ether")) // defined in migrations file

    // console.log("balanceAfter", balanceAfter)
    // console.log("balanceShouldBe", balanceShouldBe.toString())
    assert.equal(balanceAfterContributions, balanceShouldBe, "contract receives contributions")
    console.log("CONTRACT RECEIVED ETHER")

    // test payout
    await custodier.methods.payOut().send({ from: creator})
    var balanceAfterPayout = await web3.eth.getBalance(address)
    balanceShouldBe = web3.utils.toBN(web3.utils.toWei("0", "ether"))

    assert.equal(balanceAfterPayout, balanceShouldBe, "contract pays out all ether")
    console.log("CONTRACT PAID OUT ETHER")

  })
})