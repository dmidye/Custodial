// LEAVING THIS FOR NOW BUT ALL THESE TESTS ARE RUN IN CustodierFactory.test.js


// const Custodier = artifacts.require('./Custodier.sol')

// contract('Custodier', (accounts) => {
//   before(async () => {
//     custodier = await Custodier.deployed()
//   })

//   it('deploys successfully', async () => {
//     const address = await custodier.address
//     assert.notEqual(address, 0x0)
//     assert.notEqual(address, '')
//     assert.notEqual(address, null)
//     assert.notEqual(address, undefined)
//   })

//   it('sets initial variables correctly', async () => {
//       // defined in migrations
//       assert.equal(await custodier.creator(), "0x4CBAAa8755EA4FE2536e2661798B2AD2E4854d90")
//       assert.equal(await custodier.name(), "test")
//       assert.equal(await custodier.contribAmount(), web3.utils.toWei(".01", "ether"))
//   })

//   it('takes contributions', async () => {
//     // contribute
//     await custodier.contribute({ from: accounts[0], value: web3.utils.toWei(".01", "ether")})
//     const contribCount = await custodier.contribCount()
//     assert.equal(contribCount, 1)

//     // test that contract receives ether
//     var balanceAfter = await web3.eth.getBalance(custodier.address)
//     var balanceShouldBe = web3.utils.toBN(web3.utils.toWei(".01", "ether")) // defined in migrations file

//     // console.log("balanceAfter", balanceAfter)
//     // console.log("balanceShouldBe", balanceShouldBe.toString())
//     assert.equal(balanceAfter, balanceShouldBe)
//   })


// })