pragma solidity ^0.8.12;
// SPDX-License-Identifier: Lottery

contract lottery {
    struct Player {
        string name;
        address add;
        uint256 input;
    }
    modifier enoughMoney {
        require(msg.value > 0.01 ether);
        _;
    }
    modifier restricted {
        require(msg.sender == owner);
        _;
    }
    Player[] public players;
    Player[] public winners;
    address public owner;

    constructor(address _address, string memory _name, uint256 _price) {
        Player memory player = Player(_name, _address, _price);
        players.push(player);
        owner = msg.sender;
    }
    function randomNumber() private view returns(uint) {
        uint random = uint(keccak256(abi.encode(players, block.difficulty, block.timestamp)));
        return random;
    } 
    function enter(string memory _name, uint256 _price) payable enoughMoney public {
        players.push(Player(_name, msg.sender, _price));
    }
    function getWinner() public restricted returns(string memory) {
        uint randomIndex = randomNumber() % players.length;
        Player memory winner = players[randomIndex];
        winners.push(winner);
        // payable(players[index]).transfer(address(this).balance);
        players = new Player[](0);
        return winner.name;
    }
}

