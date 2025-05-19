// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// 🔁 Chainlink interface
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    AggregatorV3Interface public ethUsdPriceFeed;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
        address paymentToken;
    }

    mapping(uint => Item) public items;
    mapping(address => address) public priceFeeds; // ERC20 token => Chainlink feed

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address paymentToken
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );
    event Delisted(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed seller
    );

    constructor(uint _feePercent, address etherPriceFeed) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        ethUsdPriceFeed = AggregatorV3Interface(etherPriceFeed); // ETH/USD price feed
    }
    
    function setPriceFeed(address token, address feed) external {
        priceFeeds[token] = feed;
        // feeed = 0x4ffC43a60e009B551865A93d232E33Fce9f01507
        // token is WSOL = 0xD31a59c85aE9D8edEFeC411D448f90841571b89c 
    }

    function getTokenPriceUsd(address token) public view returns (uint256) {
        address feed = priceFeeds[token];  // USDC feed
        require(feed != address(0), "No Chainlink feed for token"); // X

        AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);  // USDC / ETH ??? USDC / USD ?? 
        (, int256 price, , , ) = priceFeed.latestRoundData();  // 1 

        return uint256(price); // price with 8 decimals  // 1
    }

    function getEthPriceUsd() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        return uint256(price); // ETH/USD price with 8 decimals
    }

    function makeItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price,
        address _paymentToken
    ) external nonReentrant {
        require(_paymentToken != address(0), "Payment token must be Ethereum ");
        require(_price > 0, "Price must be greater than zero"); //X
        require(priceFeeds[_paymentToken] != address(0), "Unsupported token");  // x 

        uint256 priceInUsd = (_price * getTokenPriceUsd(_paymentToken)) / 1e18;  // 1000 * 
        require(priceInUsd >= 10 * 1e8, "Price must be >= $10");

        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            _paymentToken
        );
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender, _paymentToken);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(!item.sold, "item already sold");

        uint _totalPrice = getTotalPrice(_itemId);
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");

        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Bought(_itemId, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price * (100 + feePercent)) / 100);
    } // ***

    function delistItem(uint _itemId) external nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(item.seller == msg.sender, "Only the seller can delist this item");
        require(!item.sold, "Item already sold");

        item.nft.transferFrom(address(this), item.seller, item.tokenId);
        item.sold = true;

        emit Delisted(_itemId, address(item.nft), item.tokenId, msg.sender);
    }

     // **
}