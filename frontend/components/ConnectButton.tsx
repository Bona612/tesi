// Default ConnectButton of Web3Modal
export default function ConnectButton() {
    return <w3m-button />
}


// DEFINE MY OWN ConnectButton

// import { useWeb3Modal } from '@web3modal/ethers/react'

// export default function ConnectButton() {
//   // 4. Use modal hook
//   const { open } = useWeb3Modal()

//   return (
//     <>
//       <button onClick={() => open()}>Open Connect Modal</button>
//       <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button>
//     </>
//   )
// }