// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Token.sol";
// TODO:
// [x] Set the fee account
// [] Deposit Ether
// [] Withdraw Ether
// [] Deposit tokens
// [] Withdraw tokens
// [] Check balances
// [] Make order
// [] Cancel order
// [] Fill order
// [] Charge fees
contract Exchange{
    address public feeAccount; //the account that receives exchange fees
    uint256 public feePercent;// fee charged by exchange
    address constant ETHER=address(0);// store ether value in tokens mapping with blank address
    uint256 public orderCount;
    
    mapping(address =>mapping(address => uint256)) public tokens;
    // id => struct _order
    mapping(uint256 => _Order) public orders; // a way to store the order
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address userFill,
        uint256 timestamp
    );

    // a way to modal the order
    struct _Order{
        uint256 id;
        address user;// person who placed order
        address tokenGet; // Token address user want to purchase
        uint256 amountGet; // amount of Token user want to purchase
        address tokenGive; //token address they are going to use in the trade
        uint256 amountGive; //amount of token they are going to give in the trade
        uint256 timestamp; // actual time when the order was created
    }

    constructor(address _feeAccount,uint256 _feePercent){
        feeAccount=_feeAccount;
        feePercent=_feePercent;
    }

    // Fallback: reverts if ether is sent to this smart contract by mistake
    fallback () external {
        revert();
    }

    function depositEther() payable public{
        // msg.value contains the amount of wei (ether / 1e18) sent in the transaction.
        tokens[ETHER][msg.sender]+=msg.value;
        emit Deposit(ETHER,msg.sender,msg.value,tokens[ETHER][msg.sender]);
    }

    function withdrawEther(uint256 _amount) public{
        require(tokens[ETHER][msg.sender] >= _amount);

        tokens[ETHER][msg.sender]-=_amount; 
        // Return ether back to the original user
        // new update payable
        payable(msg.sender).transfer(_amount);

        emit Withdraw(ETHER, msg.sender,_amount,tokens[ETHER][msg.sender]);   
    
    }

    function depositToken (address _token,uint256 _amount) public{
        // Dont allow ether deposit
        require(_token!=ETHER);

        // Send token to this contract.
        // we dont wantto any thing happen if below transaction dosent occour so we used require
        require(Token(_token).transferFrom(msg.sender,address(this), _amount));

        // Manage deposit - update balance
        tokens[_token][msg.sender]+=_amount;

        // Emit events
        emit Deposit(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public{
        require(_token!= ETHER);
        require(tokens[_token][msg.sender] >= _amount);

        tokens[_token][msg.sender]-=_amount;
        require(Token(_token).transfer(msg.sender,_amount));

        emit Withdraw(_token, msg.sender,_amount,tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns(uint256){
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        orderCount++;
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }

    function cancelOrder(uint256 _id) public {
        _Order storage _order= orders[_id];
        // Must be my order
        require(address(_order.user)==msg.sender);
        // Should be a valid order
        require(_order.id==_id);
        orderCancelled[_id]=true;
        emit Cancel(_order.id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, block.timestamp);
    }

    function fillOrder(uint256 _id) public{
        require(_id>0 && _id<=orderCount);
        require(!orderCancelled[_id]);
        require(!orderFilled[_id]);
        // Fethch the order
        _Order storage _order= orders[_id];
        _trade(_order.id,_order.user,_order.tokenGet,_order.amountGet,_order.tokenGive,_order.amountGive);
        // Mark order as filled
        orderFilled[_order.id]=true;

    }

    function _trade(uint256 _orderId,address _user, address _tokenGet,uint256 _amountGet,address _tokenGive,uint256 _amountGive) internal{
        // Fee paid by the user that fills the order, a.k.a. msg.sender.
         // Chrge fee
        uint256 _feeAmount = (_amountGet*feePercent)/(100);
        // _user created order & msg.sender filled order
        // Execute trade
        tokens[_tokenGet][msg.sender]-=_amountGet+_feeAmount;
        tokens[_tokenGet][_user] +=_amountGet;
        tokens[_tokenGet][feeAccount] += _feeAmount;
        tokens[_tokenGive][_user]-=_amountGive;
        tokens[_tokenGive][msg.sender]+=_amountGive;
       
        // Emit trade events
         emit Trade(_orderId, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, block.timestamp);
    }
}