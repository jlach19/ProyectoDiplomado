// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MentoriaWeb3 is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public precioMentoria = 0.01 ether; // Precio de la mentoría

    mapping(uint256 => address) public mentorias;
    mapping(address => uint256) public mentoriasPorUsuario;

    event MentoriaReservada(uint256 indexed id, address indexed estudiante);
    event CertificadoNFTGenerado(uint256 indexed tokenId, address indexed estudiante);

    constructor() ERC721("MentoriaNFT", "MNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function reservarMentoria() public payable {
        require(msg.value >= precioMentoria, "Pago insuficiente");

        mentorias[tokenCounter] = msg.sender;
        mentoriasPorUsuario[msg.sender]++;

        emit MentoriaReservada(tokenCounter, msg.sender);
        tokenCounter++;
    }

    function generarCertificadoNFT(string memory tokenURI) public {
        require(mentoriasPorUsuario[msg.sender] > 0, "No has reservado una mentoria");

        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit CertificadoNFTGenerado(newTokenId, msg.sender);
        tokenCounter++;
    }

    function cambiarPrecioMentoria(uint256 nuevoPrecio) public onlyOwner {
        precioMentoria = nuevoPrecio;
    }

    function retirarFondos() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
