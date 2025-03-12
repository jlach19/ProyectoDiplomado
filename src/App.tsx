//contrato 0xb98e97316E57873feE723EaF2C4f6B953049b670
// NFT https://emerald-working-koi-572.mypinata.cloud/ipfs/bafkreicj3uy5sf2ov76jgtzdxakpx2ypzmy7vdakhqlzjalj5jq4q736zy 


import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0xb98e97316E57873feE723EaF2C4f6B953049b670"; // Contrato en Arbitrum Sepolia
const TOKEN_URI = "https://emerald-working-koi-572.mypinata.cloud/ipfs/bafkreicj3uy5sf2ov76jgtzdxakpx2ypzmy7vdakhqlzjalj5jq4q736zy";
// URI del NFT

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // Conectar Wallet
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Por favor, instala MetaMask para continuar.");
      return;
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await web3Provider.getSigner(); // Obtener el signer
      const accountAddress = await signer.getAddress(); // Obtener la dirección como string
      const network = await web3Provider.getNetwork();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer); // Usar signer

      setAccount(accountAddress);
      setProvider(web3Provider);
      setContract(contractInstance);
      setNetwork(network.name);

      console.log(`Conectado a: ${network.name}`);
    } catch (error) {
      console.error("Error conectando MetaMask:", error);
      alert("No se pudo conectar a MetaMask.");
    }
  }

  // Reservar Mentoría (requiere pago)
  async function reservarMentoria() {
    if (!account || !contract) {
      alert("Conéctate a MetaMask primero.");
      return;
    }

    try {
      const precioMentoria = ethers.parseEther("0.01"); // Precio en ETH
      const tx = await contract.reservarMentoria({ value: precioMentoria });
      await tx.wait();

      alert("Mentoría reservada con éxito!");
    } catch (error: any) {
      console.error("Error en la transacción:", error);
      alert(`Error al reservar la mentoría: ${error.message}`);
    }
  }

  // Generar NFT de Certificado
  async function generarCertificado() {
    if (!account || !contract) {
      alert("Conéctate a MetaMask primero.");
      return;
    }

    try {
      const tx = await contract.generarCertificadoNFT(TOKEN_URI);
      await tx.wait();

      alert("Certificado NFT generado con éxito!");
    } catch (error: any) {
      console.error("Error al generar el NFT:", error);
      alert(`Error al generar el NFT: ${error.message}`);
    }
  }

  // Verificar conexión al cargar la página
  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.listAccounts();
        const network = await web3Provider.getNetwork();

        if (accounts.length > 0) {
          const signer = await web3Provider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

          setAccount(await signer.getAddress());
          setProvider(web3Provider);
          setContract(contractInstance);
          setNetwork(network.name);
          console.log(`Conectado a: ${network.name}`);
        }
      }
    }
    checkConnection();
  }, []);



  return (
    <div className="App">
      <h1>Mentorías Web3</h1>
      <button onClick={connectWallet}>
        {account ? `Conectado: ${account.substring(0, 6)}...` : "Conectar MetaMask"}
      </button>
      {network && <p>Red: {network}</p>}
      <button onClick={reservarMentoria} disabled={!account}>
        Reservar Mentoría (0.01 ETH)
      </button>
      <button onClick={generarCertificado} disabled={!account}>
        Generar Certificado NFT
      </button>
    </div>
  );
}

export default App;
