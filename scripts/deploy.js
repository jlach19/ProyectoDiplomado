import hardhat from "hardhat"; // Importa el paquete completo como predeterminado
const { ethers } = hardhat; 

async function main() {
    const ContractFactory = await ethers.getContractFactory("MentoriaWeb3");
    const contract = await ContractFactory.deploy();

    await contract.waitForDeployment(); //  Método correcto en Ethers v6
    console.log(`Contrato desplegado en: ${await contract.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error al desplegar:", error);
        process.exit(1);
    });
