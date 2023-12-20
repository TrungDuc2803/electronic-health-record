/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const electronicHealthRecord = require('./lib/electronicHealthRecord');

module.exports.ElectronicHealthRecord = electronicHealthRecord;
module.exports.contracts = [electronicHealthRecord];
