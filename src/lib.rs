mod pb;

use pb::example::{Contract, Contracts};

use substreams::Hex;
use substreams_entity_change::pb::entity::EntityChanges;
use substreams_entity_change::tables::Tables;
use substreams_ethereum::pb::eth;

#[substreams::handlers::map]
fn map_contract(block: eth::v2::Block) -> Result<Contracts, substreams::errors::Error> {
    let contracts = block
        .calls() // get all calls
        .filter(|view| !view.call.state_reverted) // only successful calls
        .filter(|view| view.call.call_type == eth::v2::CallType::Create as i32) // only contract creations
        .map(|view| Contract {
            address: format!("0x{}", Hex(&view.call.address)), // format the address
            block_number: block.number, // block number
            timestamp: block.timestamp_seconds().to_string(), // timestamp
            hash: Hex::encode(&block.hash), // hash
            ordinal: view.call.begin_ordinal, // ordinal
        })
        .collect(); // collect into a vector?

    Ok(Contracts { contracts }) // return the contracts
}


#[substreams::handlers::map]
pub fn graph_out(contracts: Contracts) -> Result<EntityChanges, substreams::errors::Error> {
    // hash map of name to a table
    let mut tables = Tables::new(); // create a new table

    for contract in contracts.contracts.into_iter() {
        tables // add a row to the table
            .create_row("Contract", contract.address) // create a row in the table
            .set("timestamp", contract.timestamp) // set the timestamp
            .set("hash", contract.hash) // set the hash
            .set("blockNumber", contract.block_number); // set the block number
    }

    Ok(tables.to_entity_changes())
}
