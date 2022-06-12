// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


contract Token{
    
    //Veriables 
    string public name='DApp Token';
    string public symbol="DAPP";
    uint256 public decimals=18;
    uint256 public totalSupply;
    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Modifiers
    modifier addressCheck(address _address){
        require(_address!=address(0),"Invalid Address provided");
        _;
    }

    constructor() {
        totalSupply=1000000*(10**decimals);
        balanceOf[msg.sender]=totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender]>=_value,"Insufficient balance");
        _transfer(msg.sender, _to, _value);
        return true;
    }
    //Internal function
    function _transfer(address _from, address _to, uint256 _value) addressCheck(_to)internal{
        balanceOf[_from]-=_value;
        balanceOf[_to]+=_value;
        emit Transfer(_from, _to, _value);
    }

    // Approve Tokens
    function approve(address _spender, uint256 _value) public addressCheck(_spender) returns(bool success){
        allowance[msg.sender][_spender]=_value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer from
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(balanceOf[_from]>=_value,"Insufficient balance");
        require(allowance[_from][msg.sender]>=_value,"Amount is greater than allowed amount");
        allowance[_from][msg.sender]-=_value;//reseting(adjusting) approved token
        _transfer(_from, _to, _value);
        return true;
    }
}