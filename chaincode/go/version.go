package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

func (s *SmartContract) getVersion(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	// Get the state from the ledger
	Avalbytes, err := stub.GetState("version")
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for version \"}"
		return shim.Error(jsonResp)
	}
	return shim.Success(Avalbytes)
}
