import { log, BigInt } from "@graphprotocol/graph-ts"; // install with yarn add @graphprotocol/graph-ts
import * as assembly from "./pb/assembly"; // import the generated assembly module
import { Contract } from "../generated/schema";

export function handleBlock(blockBytes: Uint8Array): void {
    let block = assembly.Block.decode(blockBytes); // Decode the block

    if (block == null) {
        log.info("null block", []);
        return;
    } else {
        log.info("Block: {}", [block.number.toString()]); // Log the block number
    }

    let contract = new Contract(block.contractAddress.toHex()); // Create a new contract entity

    contract.timestamp = block.timestamp.toString(); // Set the timestamp
    contract.hash = block.hash.toString(); // Set the hash
    contract.blockNumber = BigInt.fromI32(block.number); // Set the block number

    contract.save();
}
