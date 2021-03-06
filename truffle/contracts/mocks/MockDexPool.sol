// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Bridge.sol";


/**
 * @notice This is for test purpose.
 *
 * @dev Short life cycle
 * @dev POOL_1#sendRequestTest --> {logic bridge} --> POOL_2#setPendingRequestsDone
 */
contract MockDexPool {

	event RequestSended(bytes32 reqId);

	string constant private SET_REQUEST_TYPE = "setRequest";
	uint256 public testData = 0;

	address bridge;

	constructor(address _bridge) public {
		bridge = _bridge;
	}



  /**
   * @notice send request like second part of pool
   *
   * @dev LIFE CYCLE
   * @dev ${this pool} -> POOL_2
   * @dev ${this func} ->  bridge#transmitRequest -> node -> adpater#receiveRequest -> mockDexPool_2#receiveRequestTest -> bridge#transmitResponse(reqId) -> node -> adpater#receiveResponse -> mockDexPool_1#setPendingRequestsDone
   *
   */
	function sendRequestTestV2(uint256 testData, address secondPartPool, address oppBridge, uint chainId) external {
		require(secondPartPool != address(0), "BAD ADDRESS");
		// todo some stuff on this part pool
		// ...

		bytes memory out  = abi.encodeWithSelector(bytes4(keccak256(bytes('receiveRequestTest(uint256)'))), testData);
		bytes32 requestId = Bridge(bridge).transmitRequestV2(out, secondPartPool, oppBridge, chainId);


		emit RequestSended(requestId);
	}




 /**
   * @notice receive request on the second part of pool
   *
   * @dev LIFE CYCLE
   * @dev POOL_1 -> ${this pool}
   * @dev mockDexPool_1#sendRequestTest -> bridge#transmitRequest -> node -> adpater#receiveRequest -> ${this func} -> bridge#transmitResponse(reqId) -> node -> adpater#receiveResponse -> mockDexPool_1#setPendingRequestsDone
   *
   */
	function receiveRequestTest(uint256 _testData) public {
   		require(msg.sender == bridge, "ONLY CERTAIN BRIDGE");


     	testData = _testData;

	}
}
