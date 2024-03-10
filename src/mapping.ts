import { log, BigInt } from "@graphprotocol/graph-ts"; // install with yarn add @graphprotocol/graph-ts
import * as assembly from "./pb/assembly"; // import the generated assembly module
import { Contract } from "../generated/schema";

export function handleBlock(blockBytes: ArrayBuffer): void {
    let decoded = assembly.example.Contracts.decode(blockBytes); // Decode the block
    let block = decoded.contracts[0]; // Get the first contract

    if (block == null) {
        log.info("null block", []);
        return;
    } else {
        log.info("Block: {}", [block.address.toString()]); // Log the block number
    }

    let contract = new Contract(block.address); // Create a new contract entity

    contract.timestamp = block.timestamp.toString(); // Set the timestamp
    contract.hash = block.hash.toString(); // Set the hash
    contract.blockNumber = BigInt.fromU64(block.blockNumber); // Set the block number

    contract.save();
}
