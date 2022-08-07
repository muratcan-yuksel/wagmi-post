// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Wave {
    string public name = "Patrick";

     function setName(string memory _name) external {

        name = _name;

    }
}