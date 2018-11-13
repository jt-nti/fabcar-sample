/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/
'use strict';

const { Contract } = require('fabric-contract-api');

class FabcarContract extends Contract {

  constructor(){
    super('org.example.fabcar');
  }

  async instantiate(ctx) {
    console.info('============= NOOP : Instantiate Contract ===========');
  }

  async queryCar(ctx) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
    }
    let carNumber = args[0];

    let carAsBytes = await ctx.stub.getState(carNumber); //get the car from chaincode state
    if (!carAsBytes || carAsBytes.toString().length <= 0) {
      throw new Error(carNumber + ' does not exist: ');
    }
    console.log(carAsBytes.toString());
    return carAsBytes;
  }

  async initLedger(ctx) {
    console.info('============= START : Initialize Ledger ===========');
    let cars = [];
    cars.push({
      make: 'Toyota',
      model: 'Prius',
      color: 'blue',
      owner: 'Tomoko'
    });
    cars.push({
      make: 'Ford',
      model: 'Mustang',
      color: 'red',
      owner: 'Brad'
    });
    cars.push({
      make: 'Hyundai',
      model: 'Tucson',
      color: 'green',
      owner: 'Jin Soo'
    });
    cars.push({
      make: 'Volkswagen',
      model: 'Passat',
      color: 'yellow',
      owner: 'Max'
    });
    cars.push({
      make: 'Tesla',
      model: 'S',
      color: 'black',
      owner: 'Adriana'
    });
    cars.push({
      make: 'Peugeot',
      model: '205',
      color: 'purple',
      owner: 'Michel'
    });
    cars.push({
      make: 'Chery',
      model: 'S22L',
      color: 'white',
      owner: 'Aarav'
    });
    cars.push({
      make: 'Fiat',
      model: 'Punto',
      color: 'violet',
      owner: 'Pari'
    });
    cars.push({
      make: 'Tata',
      model: 'Nano',
      color: 'indigo',
      owner: 'Valeria'
    });
    cars.push({
      make: 'Holden',
      model: 'Barina',
      color: 'brown',
      owner: 'Shotaro'
    });

    for (let i = 0; i < cars.length; i++) {
      cars[i].docType = 'car';
      await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
      console.info('Added <--> ', cars[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async createCar(ctx) {
    console.info('============= START : Create Car ===========');
    if (args.length != 5) {
      throw new Error('Incorrect number of arguments. Expecting 5');
    }

    var car = {
      docType: 'car',
      make: args[1],
      model: args[2],
      color: args[3],
      owner: args[4]
    };

    await ctx.stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }

  async queryAllCars(ctx) {

    let startKey = 'CAR0';
    let endKey = 'CAR999';

    let iterator = await ctx.stub.getStateByRange(startKey, endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async changeCarOwner(ctx) {
    console.info('============= START : changeCarOwner ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await ctx.stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.owner = args[1];

    await ctx.stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : changeCarOwner ===========');
  }
};

module.exports = FabcarContract
