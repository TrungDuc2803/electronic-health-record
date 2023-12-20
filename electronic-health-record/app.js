/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./utils/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./utils/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'hospital';
const mspOrg1 = 'Hospital1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'Admin';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'hospital1.department1');
		
		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true }
				} // using asLocalhost as this gateway is using a fabric network deployed locally
			)
			console.log("============")
			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			await contract.submitTransaction('InitLedger');
			console.log('*** Result: committed');

			// Let's try a query type operation (function).
			// This will be sent to just one peer and the results will be shown.
			// Get All Patients
			console.log('\n--> Evaluate Transaction: GetAllPatients, function returns all the current assets on the ledger');
			let result = await contract.evaluateTransaction('GetAllPatients');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// Get All Doctors
			console.log('\n--> Evaluate Transaction: GetAllDoctors, function returns all the current assets on the ledger');
			let result1 = await contract.evaluateTransaction('GetAllDoctors');
			console.log(`*** Result: ${prettyJSONString(result1.toString())}`);

			// Get All Hospitals
			console.log('\n--> Evaluate Transaction: GetAllHospitals, function returns all the current assets on the ledger');
			let result2 = await contract.evaluateTransaction('GetAllHospitals');
			console.log(`*** Result: ${prettyJSONString(result2.toString())}`);

			// Get All Medical ecords
			console.log('\n--> Evaluate Transaction: GetAllMedicalRecords, function returns all the current assets on the ledger');
			let result3 = await contract.evaluateTransaction('GetAllMedicalRecords');
			console.log(`*** Result: ${prettyJSONString(result3.toString())}`);

			// Get All Accounts
			console.log('\n--> Evaluate Transaction: GetAllAccounts, function returns all the current assets on the ledger');
			let result4 = await contract.evaluateTransaction('ReadAllAccounts');
			console.log(`*** Result: ${prettyJSONString(result4.toString())}`);

			// Get All Log Changes
			console.log('\n--> Evaluate Transaction: GetAllAccounts, function returns all the current assets on the ledger');
			let result5 = await contract.evaluateTransaction('GetAllLogChanges');
			console.log(`*** Result: ${prettyJSONString(result5.toString())}`);
			

			/*--- Server ---*/
			const express = require('express');
			const cors = require('cors');
			const app = express();
            const port = 3001; // or any port you prefer
			// Add a route to retrieve assets
            app.use(cors()); // Use the cors middleware to enable CORS

			// Login
			app.get('/api/login', async (req, res) => {
				const { username, password, userType } = req.query;
			
				try {
					// Build an in-memory object with the network configuration
					const ccp = buildCCPOrg1();
			
					// Build an instance of the fabric CA services client
					const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');
			
					// Setup the wallet to hold the credentials of the application user
					const wallet = await buildWallet(Wallets, walletPath);
			
					const gateway = new Gateway();
					await gateway.connect(ccp, {
						wallet,
						identity: org1UserId,
						discovery: { enabled: true, asLocalhost: true }
					});
			
					// Build a network instance based on the channel where the smart contract is deployed
					const network = await gateway.getNetwork(channelName);
			
					// Get the contract from the network
					const contract = network.getContract(chaincodeName);
			
					// Call the smart contract function to authenticate the user
					const result = await contract.evaluateTransaction('AuthenticateUser', username, password, userType);
					const account = JSON.parse(result.toString());
			
					// Send the account data as JSON response
					res.status(200).json(account);
				} catch (error) {
					console.error(`Failed to authenticate user: ${error}`);
					res.status(401).json({ error: 'Authentication failed' });
				}
			});			

			// Get All Patients
			app.get('/api/patients', async (req, res) => {
				try {
					// build an in memory object with the network configuration (also known as a connection profile)
					const ccp = buildCCPOrg1();

					// build an instance of the fabric ca services client based on
					// the information in the network configuration
					const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

					// setup the wallet to hold the credentials of the application user
					const wallet = await buildWallet(Wallets, walletPath);

					const gateway = new Gateway();
					await gateway.connect(ccp, {
						wallet,
						identity: org1UserId,
						discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
					});

					// Build a network instance based on the channel where the smart contract is deployed
					const network = await gateway.getNetwork(channelName);

					// Get the contract from the network.
					const contract = network.getContract(chaincodeName);

					// Query all assets
					const result = await contract.evaluateTransaction('GetAllPatients');
					const assets = JSON.parse(result.toString());
					res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
					res.json(assets);

                    console.log("Khong co loi gi !!!");
				} catch (error) {
				console.error(`Failed to fetch assets: ${error}`);
				res.status(500).json({ error: 'Failed to fetch assets' });
				console.log("Loi Roi !!!");
				}
			});
			
			app.listen(port, () => {
				console.log(`Server is running on port ${port}`);
			});

			// Get All Doctors
			app.get('/api/doctors', async (req, res) => {
				try {
					// build an in memory object with the network configuration (also known as a connection profile)
					const ccp = buildCCPOrg1();

					// build an instance of the fabric ca services client based on
					// the information in the network configuration
					const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

					// setup the wallet to hold the credentials of the application user
					const wallet = await buildWallet(Wallets, walletPath);

					const gateway = new Gateway();
					await gateway.connect(ccp, {
						wallet,
						identity: org1UserId,
						discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
					});

					// Build a network instance based on the channel where the smart contract is deployed
					const network = await gateway.getNetwork(channelName);

					// Get the contract from the network.
					const contract = network.getContract(chaincodeName);

					// Query all assets
					const result = await contract.evaluateTransaction('GetAllDoctors');
					const assets = JSON.parse(result.toString());
					res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
					res.json(assets);

					console.log("Khong co loi gi !!!");
				} catch (error) {
				console.error(`Failed to fetch assets: ${error}`);
				res.status(500).json({ error: 'Failed to fetch assets' });
				console.log("Loi Roi !!!");
				}
			});
			// Get All Hospitals
			app.get('/api/hospitals', async (req, res) => {
				try {
					// build an in memory object with the network configuration (also known as a connection profile)
					const ccp = buildCCPOrg1();

					// build an instance of the fabric ca services client based on
					// the information in the network configuration
					const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

					// setup the wallet to hold the credentials of the application user
					const wallet = await buildWallet(Wallets, walletPath);

					const gateway = new Gateway();
					await gateway.connect(ccp, {
						wallet,
						identity: org1UserId,
						discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
					});

					// Build a network instance based on the channel where the smart contract is deployed
					const network = await gateway.getNetwork(channelName);

					// Get the contract from the network.
					const contract = network.getContract(chaincodeName);

					// Query all assets
					const result = await contract.evaluateTransaction('GetAllHospitals');
					const assets = JSON.parse(result.toString());
					res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
					res.json(assets);

					console.log("Khong co loi gi !!!");
				} catch (error) {
				console.error(`Failed to fetch assets: ${error}`);
				res.status(500).json({ error: 'Failed to fetch assets' });
				console.log("Loi Roi !!!");
				}
			});

			// Get All Medical Records
			app.get('/api/records', async (req, res) => {
				try {
					// build an in memory object with the network configuration (also known as a connection profile)
					const ccp = buildCCPOrg1();

					// build an instance of the fabric ca services client based on
					// the information in the network configuration
					const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

					// setup the wallet to hold the credentials of the application user
					const wallet = await buildWallet(Wallets, walletPath);

					const gateway = new Gateway();
					await gateway.connect(ccp, {
						wallet,
						identity: org1UserId,
						discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
					});

					// Build a network instance based on the channel where the smart contract is deployed
					const network = await gateway.getNetwork(channelName);

					// Get the contract from the network.
					const contract = network.getContract(chaincodeName);

					// Query all assets
					const result = await contract.evaluateTransaction('GetAllMedicalRecords');
					const assets = JSON.parse(result.toString());
					res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
					res.json(assets);

					console.log("Khong co loi gi !!!");
				} catch (error) {
				console.error(`Failed to fetch assets: ${error}`);
				res.status(500).json({ error: 'Failed to fetch assets' });
				console.log("Loi Roi !!!");
				}
			});
			// Get All Log Changes
			app.get('/api/logChanges', async (req, res) => {
				try {
					// build an in memory object with the network configuration (also known as a connection profile)
					const ccp = buildCCPOrg1();

					// build an instance of the fabric ca services client based on
					// the information in the network configuration
					const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

					// setup the wallet to hold the credentials of the application user
					const wallet = await buildWallet(Wallets, walletPath);

					const gateway = new Gateway();
					await gateway.connect(ccp, {
						wallet,
						identity: org1UserId,
						discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
					});

					// Build a network instance based on the channel where the smart contract is deployed
					const network = await gateway.getNetwork(channelName);

					// Get the contract from the network.
					const contract = network.getContract(chaincodeName);

					// Query all assets
					const result = await contract.evaluateTransaction('GetAllLogChanges');
					const assets = JSON.parse(result.toString());
					res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
					res.json(assets);

					console.log("Khong co loi gi !!!");
				} catch (error) {
				console.error(`Failed to fetch assets: ${error}`);
				res.status(500).json({ error: 'Failed to fetch assets' });
				console.log("Loi Roi !!!");
				}
			});

			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			/*
			console.log('\n--> Submit Transaction: CreatePatient, creates new asset with ID, color, owner, size, and appraisedValue arguments');
			result = await contract.submitTransaction('CreatePatient', 'naruto', 'hinata', 'P003', 'Naruto', 'Uzumaki', '1999-10-10', 'Male', 'Konoha');
			console.log('*** Result: committed');
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
			*/

			/*--- Server ---*/
			/* Create Patient */
            // ... (previous code)
			app.use(express.json());
			app.post('/api/create-patient', async (req, res) => {
				const { username, password, patientID, firstName, lastName, dateOfBirth, gender, contactInfo } = req.body;
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call your CreateAsset function here with the provided parameters
				// Example:
				// await contract.submitTransaction('CreateAsset', id, color, size, owner, appraisedValue);
				result = await contract.submitTransaction('CreatePatient', username, password, patientID, firstName, lastName, dateOfBirth, gender, contactInfo);
				console.log('*** Result: committed');
				if (`${result}` !== '') {
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				}
				res.status(200).json({ message: 'Patient created successfully' });
				} catch (error) {
				console.error(`Failed to create patient: ${error}`);
				res.status(500).json({ error: 'Failed to create patient' });
				}
			});
            
			/* Create Doctor */
			app.use(express.json());
			app.post('/api/create-doctor', async (req, res) => {
				const { username, password, doctorID, firstName, lastName, specialization, contactInfo, hospitalID } = req.body;
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call your CreateAsset function here with the provided parameters
				// Example:
				// await contract.submitTransaction('CreateAsset', id, color, size, owner, appraisedValue);
				result = await contract.submitTransaction('CreateDoctor', username, password, doctorID, firstName, lastName, specialization, contactInfo, hospitalID);
				console.log('*** Result: committed');
				if (`${result}` !== '') {
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				}
				res.status(200).json({ message: 'Patient created successfully' });
				} catch (error) {
				console.error(`Failed to create patient: ${error}`);
				res.status(500).json({ error: 'Failed to create patient' });
				}
			});

			/* Create Medical Record */
            // ... (previous code)
			app.use(express.json());
			app.post('/api/create-record', async (req, res) => {
				const { recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes } = req.body;
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call your CreateAsset function here with the provided parameters
				// Example:
				// await contract.submitTransaction('CreateAsset', id, color, size, owner, appraisedValue);
				result = await contract.submitTransaction('CreateMedicalRecord', recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes);
				console.log('*** Result: committed');
				if (`${result}` !== '') {
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				}
				res.status(200).json({ message: 'Medical Record created successfully' });
				} catch (error) {
				console.error(`Failed to create Medical Record: ${error}`);
				res.status(500).json({ error: 'Failed to create Medical Record' });
				}
			});

			console.log('\n--> Evaluate Transaction: ReadPatient, function returns an asset with a given patientID');
			result = await contract.evaluateTransaction('ReadPatient', 'P001');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			/*--- Server ---*/
			/*--- Read Patient ---*/
			// Route for reading an asset
			app.get('/api/read-patient/:id', async (req, res) => {
				const assetId = req.params.id;
			
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call the smart contract function to read an asset by ID
				const result = await contract.evaluateTransaction('ReadPatient', assetId);
				const asset = JSON.parse(result.toString());
			
				// Send the asset data as JSON response
				res.status(200).json(asset);
				} catch (error) {
				// Handle errors if the asset does not exist
				if (error.message.includes('does not exist')) {
					res.status(404).json({ error: `The asset ${assetId} does not exist` });
				} else {
					console.error(`Failed to read asset: ${error}`);
					res.status(500).json({ error: 'Failed to read asset' });
				}
				}
			});  

			/*--- Read Hospital ---*/
			// Route for reading an asset
			app.get('/api/read-hospital/:id', async (req, res) => {
				const assetId = req.params.id;
			
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call the smart contract function to read an asset by ID
				const result = await contract.evaluateTransaction('ReadHospital', assetId);
				const asset = JSON.parse(result.toString());
			
				// Send the asset data as JSON response
				res.status(200).json(asset);
				} catch (error) {
				// Handle errors if the asset does not exist
				if (error.message.includes('does not exist')) {
					res.status(404).json({ error: `The asset ${assetId} does not exist` });
				} else {
					console.error(`Failed to read asset: ${error}`);
					res.status(500).json({ error: 'Failed to read asset' });
				}
				}
			});  

			/*--- Read Doctor ---*/
			// Route for reading an asset
			app.get('/api/read-doctor/:id', async (req, res) => {
				const assetId = req.params.id;
			
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call the smart contract function to read an asset by ID
				const result = await contract.evaluateTransaction('ReadDoctor', assetId);
				const asset = JSON.parse(result.toString());
			
				// Send the asset data as JSON response
				res.status(200).json(asset);
				} catch (error) {
				// Handle errors if the asset does not exist
				if (error.message.includes('does not exist')) {
					res.status(404).json({ error: `The asset ${assetId} does not exist` });
				} else {
					console.error(`Failed to read asset: ${error}`);
					res.status(500).json({ error: 'Failed to read asset' });
				}
				}
			});  

			/*--- Read Medical Record ---*/
			// Route for reading an asset
			app.get('/api/read-record/:id', async (req, res) => {
				const assetId = req.params.id;
			
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call the smart contract function to read an asset by ID
				const result = await contract.evaluateTransaction('ReadMedicalRecord', assetId);
				const asset = JSON.parse(result.toString());
			
				// Send the asset data as JSON response
				res.status(200).json(asset);
				} catch (error) {
				// Handle errors if the asset does not exist
				if (error.message.includes('does not exist')) {
					res.status(404).json({ error: `The asset ${assetId} does not exist` });
				} else {
					console.error(`Failed to read asset: ${error}`);
					res.status(500).json({ error: 'Failed to read asset' });
				}
				}
			});  

			/*--- Read Medical Records By Patient Id ---*/
			// Route for reading an asset
			app.get('/api/read-records/:id', async (req, res) => {
				const assetId = req.params.id;
			
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Call the smart contract function to read an asset by ID
				const result = await contract.evaluateTransaction('GetMedicalRecordsByPatientID', assetId);
				const asset = JSON.parse(result.toString());
			
				// Send the asset data as JSON response
				res.status(200).json(asset);
				} catch (error) {
				// Handle errors if the asset does not exist
				if (error.message.includes('does not exist')) {
					res.status(404).json({ error: `The asset ${assetId} does not exist` });
				} else {
					console.error(`Failed to read asset: ${error}`);
					res.status(500).json({ error: 'Failed to read asset' });
				}
				}
			});  

			console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			result = await contract.evaluateTransaction('PatientExists', 'patient1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            
			/*
			console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
			console.log('*** Result: committed');
            */

			/*--- Server ---*/
            /*--- Update Patient ---*/
			app.use(express.json());

			// Route for updating an asset
			app.put('/api/update-patient', async (req, res) => {
			const { patientID, firstName, lastName, dateOfBirth, gender, contactInfo,username, timestamp } = req.body;
			
			try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Check if the asset with the given ID exists
				const exists = await contract.evaluateTransaction('PatientExists', patientID);
				if (!exists || exists.toString() === 'false') {
				res.status(404).json({ error: `The asset ${patientID} does not exist` });
				return;
				}

				// Update the asset with the provided data
				await contract.submitTransaction('UpdatePatient', patientID, firstName, lastName, dateOfBirth, gender, contactInfo,username, timestamp);

				// Send a success response
				res.status(200).json({ message: 'Patient updated successfully' });
			} catch (error) {
				console.error(`Failed to update patient: ${error}`);
				res.status(500).json({ error: 'Failed to update patient' });
			}
			});

            /*--- Update Doctor ---*/
			app.use(express.json());

			// Route for updating an asset
			app.put('/api/update-doctor', async (req, res) => {
			const { doctorID, firstName, lastName, specialization, contactInfo, hospitalID,username, timestamp } = req.body;
			
			try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Check if the asset with the given ID exists
				const exists = await contract.evaluateTransaction('DoctorExists', doctorID);
				if (!exists || exists.toString() === 'false') {
				res.status(404).json({ error: `The asset ${doctorID} does not exist` });
				return;
				}

				// Update the asset with the provided data
				await contract.submitTransaction('UpdateDoctor', doctorID, firstName, lastName, specialization, contactInfo, hospitalID,username, timestamp);

				// Send a success response
				res.status(200).json({ message: 'Doctor updated successfully' });
			} catch (error) {
				console.error(`Failed to update doctor: ${error}`);
				res.status(500).json({ error: 'Failed to update doctor' });
			}
			});

			/*--- Update Medical Record ---*/
			app.use(express.json());

			// Route for updating an asset
			app.put('/api/update-record', async (req, res) => {
			const { recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes,username, timestamp } = req.body;
			
			try {
				// build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);

				// Check if the asset with the given ID exists
				const exists = await contract.evaluateTransaction('MedicalRecordExists', recordID);
				if (!exists || exists.toString() === 'false') {
				res.status(404).json({ error: `The asset ${patientID} does not exist` });
				return;
				}

				// Update the asset with the provided data
				await contract.submitTransaction('UpdateMedicalRecord', recordID, patientID, doctorID, hospitalID, date, diagnosis, treatment, medications, notes,username, timestamp);

				// Send a success response
				res.status(200).json({ message: 'Medical Record updated successfully' });
			} catch (error) {
				console.error(`Failed to update Medical Record: ${error}`);
				res.status(500).json({ error: 'Failed to update Medical Record' });
			}
			});
			

			/*--- Server ---*/
			/*--- Delete Patient ---*/
			app.delete('/api/delete-patient/:id', async (req, res) => {
				const { id } = req.params;
			  
				try {
                // build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);
			  
				  // Call the DeleteAsset function to delete the asset with the given ID
				  await contract.submitTransaction('DeletePatient', id);
			  
				  console.log(`Asset ${id} deleted successfully`);
				  res.status(200).json({ message: `Patient ${id} deleted successfully` });
				} catch (error) {
				  console.error(`Failed to delete asset: ${error}`);
				  res.status(500).json({ error: `Failed to delete Patient: ${error.message}` });
				}
			});			  

			/*--- Delete Doctor ---*/
			app.delete('/api/delete-doctor/:id', async (req, res) => {
				const { id } = req.params;
				
				try {
				// build an in memory object with the network configuration (also known as a connection profile)
				const ccp = buildCCPOrg1();

				// build an instance of the fabric ca services client based on
				// the information in the network configuration
				const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital1.example.com');

				// setup the wallet to hold the credentials of the application user
				const wallet = await buildWallet(Wallets, walletPath);

				const gateway = new Gateway();
				await gateway.connect(ccp, {
					wallet,
					identity: org1UserId,
					discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
				});

				// Build a network instance based on the channel where the smart contract is deployed
				const network = await gateway.getNetwork(channelName);

				// Get the contract from the network.
				const contract = network.getContract(chaincodeName);
				
					// Call the DeleteAsset function to delete the asset with the given ID
					await contract.submitTransaction('DeleteDoctor', id);
				
					console.log(`Asset ${id} deleted successfully`);
					res.status(200).json({ message: `Doctor ${id} deleted successfully` });
				} catch (error) {
					console.error(`Failed to delete asset: ${error}`);
					res.status(500).json({ error: `Failed to delete Doctor: ${error.message}` });
				}
			});			  

			console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			result = await contract.evaluateTransaction('ReadPatient', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			try {
				// How about we try a transactions where the executing chaincode throws an error
				// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
				console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
				await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
				console.log('******** FAILED to return an error');
			} catch (error) {
				console.log(`*** Successfully caught the error: \n    ${error}`);
			}

			console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
			await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
			console.log('*** Result: committed');

			console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
