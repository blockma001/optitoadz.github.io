import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectBtn")
const mintButton = document.getElementById("mintBtn")
const lablemint = document.getElementById("p11")
connectButton.onclick = connect
mintButton.onclick = mint

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    const chainid = window.ethereum.networkVersion
    console.log(chainid)
    if (chainid != 10) {
      window.alert('Please Switch To Optimism!')
    } else {
      totalSupply()
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
      window.alert('Connect Wallet Sucess!')
      
    }
    
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}


async function totalSupply() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const transactionResponse = await contract.totalSupply()
      let transactionResponse2 = parseInt(transactionResponse._hex)
      console.log(transactionResponse2)
      const sult = `Minting Supply: ${transactionResponse2}/6969`
      lablemint.innerHTML = sult;
    } catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}



async function mint() {
  if(document.getElementById("ethAmount").value == "" || parseInt(document.getElementById("ethAmount").value) > 10 || parseInt(document.getElementById("ethAmount").value) < 1) {
    window.alert('Please input amount!')
  } else {
    const ethAmount = parseInt(document.getElementById("ethAmount").value)
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.mint(ethAmount,{
          value: ethers.utils.parseEther((ethAmount*0.00088).toString()),
        })
        await listenForTransactionMine(transactionResponse, provider)
      } catch (error) {
        console.log(error)
      }
    } else {
      fundButton.innerHTML = "Please install MetaMask"
    }
  }

}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    window.alert(`Mining in progess, Txhash ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                window.alert('Success!')
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}
